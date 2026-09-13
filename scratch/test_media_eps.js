require('dotenv').config({ path: '/root/garage/.env' });
const { prisma } = require('/root/garage/apps/api/dist/db');
const { decrypt } = require('/root/garage/apps/api/dist/settings/integrations.router');

async function testMediaEndpoints() {
  const keys = await prisma.integrationKey.findMany({ where: { service: { in: ['WHATSAPP', 'META'] } } });
  let graftyKey = '', graftyUrl = 'https://grafty.pro';
  for (const k of keys) {
    if (k.keyName === 'GRAFTY_API_KEY') graftyKey = decrypt(k.encryptedValue);
    if (k.keyName === 'GRAFTY_API_URL') graftyUrl = decrypt(k.encryptedValue);
  }

  const eps = [
    '/api/v1/media',
    '/api/v1/media/upload',
    '/api/media/upload',
    '/api/media/local',
    '/api/v1/upload'
  ];

  for (const ep of eps) {
    const res = await fetch(`${graftyUrl}${ep}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${graftyKey}`, 'x-api-key': graftyKey }
    }).catch(e => ({ status: e.message }));
    console.log(ep, '-> GET status:', res.status);
  }
}

testMediaEndpoints().then(() => process.exit(0)).catch(e => console.error(e));
