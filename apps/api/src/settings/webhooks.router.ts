import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import crypto from 'crypto';
import { generateWebhookSignature } from '../services/webhook-dispatcher.service';

const CreateWebhookSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  url: z.string().url('Must be a valid HTTP/HTTPS URL'),
  events: z.array(z.string()).min(1, 'Select at least one event trigger'),
  secret: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export default async function webhooksRouter(app: FastifyInstance) {
  // GET /api/v1/settings/webhooks - List all webhook endpoints
  app.get('/webhooks', async (req, reply) => {
    try {
      const endpoints = await app.prisma.webhookEndpoint.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return endpoints;
    } catch (err: any) {
      app.log.error(err, 'Failed to fetch webhook endpoints');
      return reply.code(500).send({ error: 'Failed to fetch webhooks' });
    }
  });

  // POST /api/v1/settings/webhooks - Create or Update webhook endpoint
  app.post('/webhooks', async (req, reply) => {
    try {
      const body = CreateWebhookSchema.parse(req.body);
      const secret = body.secret && body.secret.trim() !== ''
        ? body.secret.trim()
        : `whsec_${crypto.randomBytes(16).toString('hex')}`;

      if (body.id) {
        const updated = await app.prisma.webhookEndpoint.update({
          where: { id: body.id },
          data: {
            name: body.name || undefined,
            url: body.url,
            events: body.events,
            secret,
            isActive: body.isActive ?? true,
          },
        });
        return updated;
      } else {
        const created = await app.prisma.webhookEndpoint.create({
          data: {
            name: body.name || 'Custom Webhook',
            url: body.url,
            events: body.events,
            secret,
            isActive: body.isActive ?? true,
          },
        });
        return created;
      }
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.code(400).send({ error: err.errors[0]?.message || 'Invalid webhook data' });
      }
      app.log.error(err, 'Failed to save webhook endpoint');
      return reply.code(500).send({ error: 'Failed to save webhook endpoint' });
    }
  });

  // DELETE /api/v1/settings/webhooks/:id - Delete webhook endpoint
  app.delete('/webhooks/:id', async (req, reply) => {
    try {
      const { id } = req.params as { id: string };
      await app.prisma.webhookEndpoint.delete({ where: { id } });
      return reply.code(204).send();
    } catch (err: any) {
      app.log.error(err, 'Failed to delete webhook endpoint');
      return reply.code(500).send({ error: 'Failed to delete webhook endpoint' });
    }
  });

  // POST /api/v1/settings/webhooks/:id/test - Send test ping to webhook endpoint
  app.post('/webhooks/:id/test', async (req, reply) => {
    try {
      const { id } = req.params as { id: string };
      const endpoint = await app.prisma.webhookEndpoint.findUnique({ where: { id } });
      if (!endpoint) {
        return reply.code(404).send({ error: 'Webhook endpoint not found' });
      }

      const timestamp = Math.floor(Date.now() / 1000);
      const testPayload = {
        event: 'webhook.test_ping',
        timestamp,
        data: {
          message: 'This is a test notification from Echo LMS Webhook System.',
          endpointId: endpoint.id,
          events: endpoint.events,
          sentAt: new Date().toISOString(),
        },
      };
      const bodyStr = JSON.stringify(testPayload);
      const secret = endpoint.secret || 'whsec_echo_test';
      const signature = generateWebhookSignature(bodyStr, secret);

      try {
        const res = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'EchoLMS-Webhook/1.0',
            'X-Echo-Signature': signature,
            'X-Echo-Event': 'webhook.test_ping',
            'X-Echo-Timestamp': String(timestamp),
          },
          body: bodyStr,
          signal: AbortSignal.timeout(8000),
        });

        const text = await res.text().catch(() => '');
        return {
          success: res.ok,
          statusCode: res.status,
          responseSnippet: text.slice(0, 500) || '(No response body)',
        };
      } catch (err: any) {
        return reply.code(400).send({
          success: false,
          error: `Failed to reach endpoint: ${err.message || 'Connection timeout'}`,
        });
      }
    } catch (err: any) {
      app.log.error(err, 'Test webhook failed');
      return reply.code(500).send({ error: 'Failed to test webhook' });
    }
  });
}
