const { prisma } = require('./apps/api/dist/db');
const { decrypt } = require('./apps/api/dist/settings/integrations.router');

async function run() {
  const keys = await prisma.integrationKey.findMany({ where: { service: { in: ['WHATSAPP', 'META'] } } });
  let graftyKey = '', graftyUrl = 'https://grafty.pro', graftyInstanceId = '';
  for (const k of keys) {
    const val = decrypt(k.encryptedValue);
    if (k.keyName === 'GRAFTY_API_KEY') graftyKey = val;
    if (k.keyName === 'GRAFTY_API_URL') graftyUrl = val;
    if (k.keyName === 'GRAFTY_INSTANCE_ID') graftyInstanceId = val;
  }

  const sampleMedia = 'https://pdfobject.com/pdf/sample.pdf';

  console.log('--- TEST 1: grafty_welcome WITH MEDIA URL ---');
  const payload1 = {
    instance_id: graftyInstanceId,
    phone: '919042583701',
    to: '919042583701',
    recipient: { phone: '919042583701', name: 'Stalin' },
    template: {
      name: 'grafty_welcome',
      language: 'en_US',
      components: []
    },
    media_url: sampleMedia,
    mediaUrl: sampleMedia
  };

  const res1 = await fetch(graftyUrl + '/api/v1/messages/send-template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + graftyKey, 'x-api-key': graftyKey },
    body: JSON.stringify(payload1)
  });
  console.log('Test 1 -> Status:', res1.status, await res1.text());

  console.log('\n--- TEST 2: GRAFTY DIRECT MEDIA MESSAGE ---');
  const payload2 = {
    instance_id: graftyInstanceId,
    phone: '919042583701',
    to: '919042583701',
    recipient: '919042583701',
    message: 'Hello Stalin,\n\nPlease find attached your proposal document:\n' + sampleMedia,
    caption: 'Official Proposal Document - Grekam Visuals',
    media_url: sampleMedia,
    mediaUrl: sampleMedia
  };

  const res2 = await fetch(graftyUrl + '/api/v1/messages/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + graftyKey, 'x-api-key': graftyKey },
    body: JSON.stringify(payload2)
  });
  console.log('Test 2 -> Status:', res2.status, await res2.text());
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
