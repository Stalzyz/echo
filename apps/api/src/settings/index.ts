import { FastifyInstance } from 'fastify';
import * as cookie from 'cookie';
import rbacRoutes from './rbac.router';
import organizationRouter from './organization.router';
import financeSettingsRouter from './finance.router';
import integrationKeysRouter from './integrations.router';
import auditLogsRouter from './audit-logs.router';
import emailTemplatesRouter from './emailTemplates.router';
import webhooksRouter from './webhooks.router';

export default async function settingsModule(app: FastifyInstance) {
  // Populate authenticated user context for settings module routes
  app.addHook('preHandler', async (req, reply) => {
    const cookies = cookie.parse(req.headers.cookie || '');
    const hasToken = req.headers.authorization || 
      cookies['__Secure-authjs.session-token'] || 
      cookies['authjs.session-token'] || 
      cookies['__Secure-next-auth.session-token'] || 
      cookies['next-auth.session-token'];

    if (hasToken) {
      try {
        await app.requireAuth(req, reply);
      } catch (e) {
        // Allow unauthenticated requests to fall through to public defaults
      }
    }
  });

  await app.register(rbacRoutes);
  await app.register(organizationRouter);
  await app.register(financeSettingsRouter);
  await app.register(integrationKeysRouter);
  await app.register(webhooksRouter);
  await app.register(auditLogsRouter);
  await app.register(emailTemplatesRouter, { prefix: '/templates' });
}


