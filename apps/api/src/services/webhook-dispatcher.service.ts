import { FastifyInstance } from 'fastify';
import crypto from 'crypto';

/**
 * Generate HMAC SHA-256 signature for outgoing webhook payload
 */
export function generateWebhookSignature(payloadString: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  return 'sha256=' + hmac.update(payloadString).digest('hex');
}

/**
 * Dispatch an event asynchronously to all active subscribed WebhookEndpoints
 */
export async function dispatchWebhookEvent(
  app: FastifyInstance,
  event: string,
  payload: Record<string, any>
): Promise<void> {
  try {
    const endpoints = await app.prisma.webhookEndpoint.findMany({
      where: {
        isActive: true,
      },
    });

    if (endpoints.length === 0) return;

    // Filter endpoints that subscribe to this specific event or '*' wildcard
    const targetEndpoints = endpoints.filter(
      ep => ep.events.includes(event) || ep.events.includes('*') || ep.events.includes('all')
    );

    if (targetEndpoints.length === 0) return;

    const timestamp = Math.floor(Date.now() / 1000);
    const bodyObj = {
      event,
      timestamp,
      data: payload,
    };
    const bodyStr = JSON.stringify(bodyObj);

    for (const ep of targetEndpoints) {
      // Fire-and-forget async dispatch
      (async () => {
        const secret = ep.secret || 'whsec_echo_default';
        const signature = generateWebhookSignature(bodyStr, secret);

        try {
          const res = await fetch(ep.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'EchoLMS-Webhook/1.0',
              'X-Echo-Signature': signature,
              'X-Echo-Event': event,
              'X-Echo-Timestamp': String(timestamp),
            },
            body: bodyStr,
            signal: AbortSignal.timeout(10000), // 10 second timeout
          });

          const resText = await res.text().catch(() => '');
          const statusStr = res.ok ? 'PROCESSED' : 'FAILED';

          await app.prisma.webhookLog.create({
            data: {
              provider: 'CUSTOM_OUTGOING',
              eventId: `evt_${event}_${ep.id}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
              eventType: event,
              status: statusStr,
              payload: {
                endpointId: ep.id,
                url: ep.url,
                statusCode: res.status,
                responseSnippet: resText.slice(0, 500),
              },
              error: res.ok ? undefined : `HTTP ${res.status}: ${resText.slice(0, 200)}`,
            },
          }).catch(() => {});
        } catch (err: any) {
          app.log.error({ err, url: ep.url, event }, '[Webhook Dispatcher] Failed to deliver webhook');
          await app.prisma.webhookLog.create({
            data: {
              provider: 'CUSTOM_OUTGOING',
              eventId: `evt_${event}_${ep.id}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
              eventType: event,
              status: 'FAILED',
              payload: { endpointId: ep.id, url: ep.url },
              error: err.message || 'Request failed / network timeout',
            },
          }).catch(() => {});
        }
      })();
    }
  } catch (err: any) {
    app.log.error({ err }, '[Webhook Dispatcher] Error querying webhook endpoints');
  }
}
