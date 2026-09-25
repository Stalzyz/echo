import { NextResponse } from  "next/server"
import { auth } from  "@/auth"
import { prisma } from  "@/lib/prisma"
import { SubscriptionEntitlementService } from  "@/lib/services/subscription-entitlement.service"
import { BillingCycle, SubscriptionInvoiceStatus, PaymentStatus, SubscriptionStatus } from  "@grekam/db"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organizationId = session.user.organizationId
    const body = await req.json()
    const { targetPlanId, billingCycle = "YEARLY", idempotencyKey } = body

    if (!targetPlanId) {
      return NextResponse.json({ error: "Target plan ID is required" }, { status: 400 })
    }

    const plan = await prisma.saaSPlan.findUnique({
      where: { id: targetPlanId }
    })

    if (!plan || !plan.isActive) {
      return NextResponse.json({ error: "Selected plan is not available" }, { status: 400 })
    }

    // Idempotency check for duplicate payment orders
    if (idempotencyKey) {
      const existingPayment = await prisma.subscriptionPayment.findUnique({
        where: { idempotencyKey }
      })
      if (existingPayment) {
        return NextResponse.json({
          success: true,
          idempotentReplay: true,
          paymentId: existingPayment.id,
          orderId: existingPayment.providerOrderId,
          status: existingPayment.status
        })
      }
    }

    const sub = await SubscriptionEntitlementService.getOrganizationSubscription(organizationId)
    const org = await prisma.organization.findUnique({ where: { id: organizationId } })

    const isYearly = billingCycle === "YEARLY"
    const baseAmount = isYearly 
      ? (plan.offerPriceYearly || plan.yearlyPrice) 
      : (plan.monthlyPrice || Math.round((plan.offerPriceYearly || plan.yearlyPrice) / 12))

    const taxRate = plan.taxRate || 18.0
    const taxAmount = Math.round((baseAmount * taxRate) / 100)
    const totalAmount = baseAmount + taxAmount

    const now = new Date()
    const periodEnd = new Date(now.getTime() + (isYearly ? 365 : 30) * 24 * 60 * 60 * 1000)
    const invoiceNumber = `ECHO-INV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`
    const orderId = `order_${Date.now().toString().slice(-8)}_${Math.random().toString(36).substring(2, 7)}`

    // Generate Invoice and Pending Payment inside atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      const invoice = await tx.subscriptionInvoice.create({
        data: {
          organizationId,
          subscriptionId: sub.id,
          invoiceNumber,
          status: SubscriptionInvoiceStatus.ISSUED,
          billingReason: "SUBSCRIPTION_CHECKOUT",
          currency: plan.currency || "INR",
          baseAmount,
          discountAmount: 0,
          taxRate,
          taxAmount,
          totalAmount,
          periodStart: now,
          periodEnd,
          dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
          immutableSnapshot: {
            organizationName: org?.name,
            organizationSlug: org?.slug,
            billingEmail: org?.ownerEmail,
            gstNumber: org?.gstNumber,
            planName: plan.name,
            planSlug: plan.slug,
            billingCycle
          }
        }
      })

      const payment = await tx.subscriptionPayment.create({
        data: {
          organizationId,
          subscriptionId: sub.id,
          invoiceId: invoice.id,
          provider: "RAZORPAY",
          providerOrderId: orderId,
          amount: totalAmount,
          currency: plan.currency || "INR",
          status: PaymentStatus.PENDING,
          idempotencyKey: idempotencyKey || `idem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          paymentMethod: "UPI / CARD / NETBANKING"
        }
      })

      return { invoice, payment }
    })

    return NextResponse.json({
      success: true,
      order: {
        orderId: result.payment.providerOrderId,
        paymentId: result.payment.id,
        invoiceId: result.invoice.id,
        invoiceNumber: result.invoice.invoiceNumber,
        amount: totalAmount,
        currency: plan.currency || "INR",
        planName: plan.name,
        customPaymentLink: plan.customPaymentLink
      }
    })
  } catch (error: any) {
    console.error("Error creating subscription checkout order:", error)
    return NextResponse.json({ error: error.message || "Failed to initiate checkout" }, { status: 500 })
  }
}
