import { NextResponse } from  "next/server"
import { prisma } from  "@/lib/prisma"
import { SubscriptionEntitlementService } from  "@/lib/services/subscription-entitlement.service"
import { SubscriptionStatus, SubscriptionInvoiceStatus, PaymentStatus } from  "@grekam/db"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get("x-razorpay-signature") || req.headers.get("x-webhook-signature")
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.PAYMENT_WEBHOOK_SECRET || "echo_webhook_secret_fallback_key"

    // Optional cryptographic verification if secret configured and signature provided
    if (signature && webhookSecret && process.env.NODE_ENV === "production") {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex")

      if (signature !== expectedSignature) {
        console.warn("[Webhook Security] Invalid signature rejected.")
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
      }
    }

    let payload: any
    try {
      payload = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 })
    }

    const eventId = payload.event_id || payload.id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    const eventType = payload.event || payload.type || "payment.captured"

    // 1. IDEMPOTENCY CHECK: Deduplicate events
    const existingLog = await prisma.webhookLog.findUnique({
      where: { eventId }
    })

    if (existingLog) {
      console.log(`[Webhook Idempotency] Event ${eventId} already processed with status ${existingLog.status}. Returning 200 OK.`)
      return NextResponse.json({ success: true, message: "Event already processed (Idempotent replay)", eventId })
    }

    // Record webhook reception log immediately
    await prisma.webhookLog.create({
      data: {
        provider: "RAZORPAY",
        eventId,
        eventType,
        status: "PROCESSING",
        payload
      }
    })

    const paymentEntity = payload.payload?.payment?.entity || payload.payment || payload.data?.object || {}
    const orderId = paymentEntity.order_id || payload.order_id
    const paymentId = paymentEntity.id || payload.payment_id
    const amount = paymentEntity.amount ? paymentEntity.amount / 100 : payload.amount

    // Locate matching pending payment or subscription invoice
    let paymentRecord = null
    if (orderId) {
      paymentRecord = await prisma.subscriptionPayment.findFirst({
        where: { providerOrderId: orderId }
      })
    }

    if (!paymentRecord && paymentEntity.notes?.organizationId) {
      paymentRecord = await prisma.subscriptionPayment.findFirst({
        where: { organizationId: paymentEntity.notes.organizationId },
        orderBy: { createdAt: "desc" }
      })
    }

    const now = new Date()

    // 2. PROCESS PAYMENT SUCCESS
    if (eventType === "payment.captured" || eventType === "order.paid" || eventType === "invoice.paid") {
      if (paymentRecord) {
        await prisma.$transaction(async (tx) => {
          // Update payment record
          await tx.subscriptionPayment.update({
            where: { id: paymentRecord.id },
            data: {
              status: PaymentStatus.SUCCESS,
              providerPaymentId: paymentId || paymentRecord.providerPaymentId,
              updatedAt: now
            }
          })

          // Mark invoice as PAID
          if (paymentRecord.invoiceId) {
            await tx.subscriptionInvoice.update({
              where: { id: paymentRecord.invoiceId },
              data: {
                status: SubscriptionInvoiceStatus.PAID,
                paidAt: now,
                updatedAt: now
              }
            })
          }

          // Advance subscription to ACTIVE and extend period
          const sub = await tx.tenantSubscription.findUnique({
            where: { id: paymentRecord.subscriptionId },
            include: { plan: true }
          })

          if (sub) {
            const extensionDays = sub.billingCycle === "MONTHLY" ? 30 : 365
            const newPeriodEnd = new Date(Math.max(sub.currentPeriodEnd.getTime(), now.getTime()) + extensionDays * 24 * 60 * 60 * 1000)

            await tx.tenantSubscription.update({
              where: { id: sub.id },
              data: {
                status: SubscriptionStatus.ACTIVE,
                currentPeriodEnd: newPeriodEnd,
                cancelAtPeriodEnd: false,
                suspendedAt: null,
                updatedAt: now
              }
            })

            await tx.organization.update({
              where: { id: sub.organizationId },
              data: { status: "ACTIVE" }
            })

            await tx.subscriptionEvent.create({
              data: {
                subscriptionId: sub.id,
                organizationId: sub.organizationId,
                eventType: "PAYMENT_SUCCESS",
                fromStatus: sub.status,
                toStatus: SubscriptionStatus.ACTIVE,
                reason: `Payment of ₹${amount || paymentRecord.amount} captured successfully (Payment ID: ${paymentId})`,
                source: "WEBHOOK",
                metadata: { paymentId, orderId, eventId }
              }
            })
          }
        })
      }
    }

    // 3. PROCESS PAYMENT FAILURE
    else if (eventType === "payment.failed") {
      if (paymentRecord) {
        await prisma.$transaction(async (tx) => {
          await tx.subscriptionPayment.update({
            where: { id: paymentRecord.id },
            data: {
              status: PaymentStatus.FAILED,
              failureReason: paymentEntity.error_description || "Card/Bank declined",
              updatedAt: now
            }
          })

          const sub = await tx.tenantSubscription.findUnique({
            where: { id: paymentRecord.subscriptionId },
            include: { plan: true }
          })

          if (sub && sub.status === SubscriptionStatus.ACTIVE) {
            const gracePeriodDays = sub.plan.gracePeriodDays || 7
            const gracePeriodEnd = new Date(now.getTime() + gracePeriodDays * 24 * 60 * 60 * 1000)

            await tx.tenantSubscription.update({
              where: { id: sub.id },
              data: {
                status: SubscriptionStatus.GRACE_PERIOD,
                gracePeriodEnd,
                updatedAt: now
              }
            })

            await tx.subscriptionEvent.create({
              data: {
                subscriptionId: sub.id,
                organizationId: sub.organizationId,
                eventType: "PAYMENT_FAILED",
                fromStatus: sub.status,
                toStatus: SubscriptionStatus.GRACE_PERIOD,
                reason: `Payment failed. Account placed in ${gracePeriodDays}-day grace period until ${gracePeriodEnd.toISOString().split('T')[0]}.`,
                source: "WEBHOOK",
                metadata: { error: paymentEntity.error_description, eventId }
              }
            })
          }
        })
      }
    }

    // 4. PROCESS REFUND
    else if (eventType === "refund.processed" || eventType === "payment.refunded") {
      if (paymentRecord) {
        await prisma.$transaction(async (tx) => {
          await tx.subscriptionPayment.update({
            where: { id: paymentRecord.id },
            data: {
              status: PaymentStatus.REFUNDED,
              refundAmount: amount || paymentRecord.amount,
              refundReason: payload.payload?.refund?.entity?.notes?.reason || "Customer refund",
              refundedAt: now,
              updatedAt: now
            }
          })

          await tx.subscriptionEvent.create({
            data: {
              subscriptionId: paymentRecord.subscriptionId,
              organizationId: paymentRecord.organizationId,
              eventType: "REFUND_PROCESSED",
              reason: `Refund of ₹${amount || paymentRecord.amount} processed`,
              source: "WEBHOOK",
              metadata: { eventId, paymentId }
            }
          })
        })
      }
    }

    // Mark webhook log as successfully processed
    await prisma.webhookLog.update({
      where: { eventId },
      data: {
        status: "PROCESSED",
        processedAt: new Date()
      }
    })

    return NextResponse.json({ success: true, processedEvent: eventType, eventId })
  } catch (error: any) {
    console.error("[Payment Webhook Error]:", error)
    return NextResponse.json({ error: error.message || "Webhook processing failed" }, { status: 500 })
  }
}
