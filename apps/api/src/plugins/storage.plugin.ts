import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

declare module 'fastify' {
  interface FastifyInstance {
    s3: {
      client: S3Client;
      bucket: string;
      generateUploadUrl: (key: string, contentType: string) => Promise<string>;
      generateDownloadUrl: (key: string) => Promise<string>;
    };
  }
}

const storagePlugin: FastifyPluginAsync = async (fastify, opts) => {
  const region = process.env.AWS_REGION || 'auto';
  const bucket = process.env.R2_BUCKET_NAME || process.env.AWS_S3_BUCKET || 'echo';
  const endpoint = process.env.R2_ENDPOINT_URL || process.env.AWS_S3_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '';
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '';
  const publicDomain = process.env.R2_PUBLIC_DOMAIN || '';

  const clientConfig: any = {
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  };

  if (endpoint) {
    clientConfig.endpoint = endpoint;
  }

  const client = new S3Client(clientConfig);

  const generateUploadUrl = async (key: string, contentType: string) => {
    if (!accessKeyId || accessKeyId === 'dummy-access') {
      return '/api/v1/storage/mock-upload';
    }

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });
    // Link expires in 15 minutes
    return await getSignedUrl(client, command, { expiresIn: 900 });
  };

  const generateDownloadUrl = async (key: string) => {
    if (publicDomain) {
      const cleanDomain = publicDomain.replace(/\/$/, '');
      const cleanKey = key.replace(/^\//, '');
      return `${cleanDomain}/${cleanKey}`;
    }

    if (!accessKeyId || accessKeyId === 'dummy-access') {
      return `/api/v1/storage/asset/${key}`;
    }

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    // Link expires in 60 minutes
    return await getSignedUrl(client, command, { expiresIn: 3600 });
  };

  fastify.decorate('s3', {
    client,
    bucket,
    generateUploadUrl,
    generateDownloadUrl,
  });
};

export default fp(storagePlugin);
