import { FastifyInstance } from 'fastify';
import { sendEmail } from '../integrations/email.service';

export interface EmailRenderResult {
  subject: string;
  html: string;
}

import { buildMasterEmailHtml } from '../integrations/email.service';

export function renderEmailTemplate(
  templateBody: string,
  subjectPattern: string,
  data: Record<string, any>
): EmailRenderResult {
  let renderedBody = templateBody || '';
  let renderedSubject = subjectPattern || '';

  // Replace all {{variable}} placeholders with data values
  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
    const val = data[key] !== undefined && data[key] !== null ? String(data[key]) : '';
    renderedBody = renderedBody.replace(regex, val);
    renderedSubject = renderedSubject.replace(regex, val);
  });

  // Automatically inline button and paragraph styles for full client support (Gmail, Outlook, Apple Mail)
  renderedBody = renderedBody.replace(
    /class=["']btn-primary["']/gi,
    `style="display:inline-block;background-color:#4f46e5;color:#ffffff !important;text-decoration:none !important;font-weight:600;font-size:14px;padding:13px 26px;border-radius:8px;text-align:center;box-shadow:0 2px 4px rgba(79,70,229,0.2);"`
  );

  renderedBody = renderedBody.replace(
    /class=["']button-container["']/gi,
    `style="margin:26px 0;text-align:center;"`
  );

  // Wrap inside the master client-safe responsive email layout
  const html = buildMasterEmailHtml(renderedBody, renderedSubject);

  return {
    subject: renderedSubject,
    html,
  };
}

export async function sendTemplatedEmail(
  app: FastifyInstance,
  options: {
    code: string;
    to: string;
    data: Record<string, any>;
  }
) {
  try {
    const template = await app.prisma.emailTemplate.findUnique({
      where: { code: options.code },
    });

    if (!template || !template.isActive) {
      app.log.warn(`Email template ${options.code} is inactive or not found.`);
      return false;
    }

    const { subject, html } = renderEmailTemplate(
      template.bodyHtml,
      template.subject,
      options.data
    );

    // Send email using real SMTP transport!
    const result = await sendEmail(options.to, { subject, html });
    app.log.info(`[EMAIL TRANSMITTED] To: ${options.to} | Subject: ${subject} | MessageId: ${result.messageId}`);
    return { success: true, subject, html, messageId: result.messageId, previewUrl: result.previewUrl };
  } catch (err: any) {
    app.log.error(`Failed to send templated email (${options.code}): ${err.message}`);
    return false;
  }
}
