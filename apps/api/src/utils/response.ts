import { FastifyReply } from 'fastify';

export interface ApiResponseEnvelope<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: Record<string, any>;
}

/**
 * Send a standardized successful API response
 */
export function sendSuccess<T = any>(
  reply: FastifyReply,
  data: T,
  statusCode = 200,
  meta?: Record<string, any>
) {
  const payload: ApiResponseEnvelope<T> = {
    success: true,
    data,
    ...(meta ? { meta } : {}),
  };
  return reply.code(statusCode).send(payload);
}

/**
 * Send a standardized API error response
 */
export function sendError(
  reply: FastifyReply,
  message: string,
  code = 'BAD_REQUEST',
  statusCode = 400,
  details: any = null
) {
  const payload: ApiResponseEnvelope = {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  };
  return reply.code(statusCode).send(payload);
}
