require('dotenv').config({ path: '/root/garage/.env' });
const { prisma } = require('/root/garage/apps/api/dist/db');
const { decrypt } = require('/root/garage/apps/api/dist/settings/integrations.router');

async function testGraftyMedia() {
  const keys = await prisma.integrationKey.findMany({ where: { service: { in: ['WHATSAPP', 'META'] } } });
  let graftyKey = '', graftyUrl = 'https://grafty.pro', graftyInstanceId = '';
  for (const k of keys) {
    if (k.keyName === 'GRAFTY_API_KEY') graftyKey = decrypt(k.encryptedValue);
    if (k.keyName === 'GRAFTY_API_URL') graftyUrl = decrypt(k.encryptedValue);
    if (k.keyName === 'GRAFTY_INSTANCE_ID') graftyInstanceId = decrypt(k.encryptedValue);
  }

  const sampleImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';

  console.log('--- TEST: Direct Media Message via Grafty /api/v1/messages/send ---');
  const p = {
    instance_id: graftyInstanceId,
    to: '919042583701',
    phone: '919042583701',
    recipient: '919042583701',
    message: 'Stop Renting Your Shopify Store.\n\nOwn your platform. Save thousands every month.',
    type: 'image',
    media_url: sampleImage,
    mediaUrl: sampleImage,
    caption: 'Stop Renting Your Shopify Store.'
  };

  const res = await fetch(graftyUrl + '/api/v1/messages/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + graftyKey, 'x-api-key': graftyKey },
    body: JSON.stringify(p)
  });
  console.log('Direct send status:', res.status, await res.text());
}

testGraftyMedia().then(() => process.exit(0)).catch(e => console.error(e));
