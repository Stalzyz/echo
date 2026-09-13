require('dotenv').config({ path: '/root/garage/.env' });
const { prisma } = require('/root/garage/apps/api/dist/db');
const { decrypt } = require('/root/garage/apps/api/dist/settings/integrations.router');

async function test() {
  const keys = await prisma.integrationKey.findMany({ where: { service: { in: ['WHATSAPP', 'META'] } } });
  let graftyKey = '', graftyUrl = 'https://grafty.pro', graftyInstanceId = '';
  let metaToken = '', metaPhoneId = '';
  for (const k of keys) {
    if (k.keyName === 'GRAFTY_API_KEY') graftyKey = decrypt(k.encryptedValue);
    if (k.keyName === 'GRAFTY_API_URL') graftyUrl = decrypt(k.encryptedValue);
    if (k.keyName === 'GRAFTY_INSTANCE_ID') graftyInstanceId = decrypt(k.encryptedValue);
    if (k.keyName === 'META_ACCESS_TOKEN') metaToken = decrypt(k.encryptedValue);
    if (k.keyName === 'META_PHONE_NUMBER_ID') metaPhoneId = decrypt(k.encryptedValue);
  }

  const sampleImage = 'https://agency.grekam.in/portfolio_showcase.png';

  console.log('\n=== TEST 1: components: [] (empty) ===');
  const res1 = await fetch(graftyUrl + '/api/v1/messages/send-template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + graftyKey, 'x-api-key': graftyKey },
    body: JSON.stringify({
      instance_id: graftyInstanceId,
      recipient: { phone: '919042583701', name: 'Stalin' },
      template: { name: 'grafty_common_template_all_industries', language: 'en_US', components: [] }
    })
  });
  console.log('Result 1 (components: []):', res1.status, await res1.text());

  console.log('\n=== TEST 2: language: "en" with Image Header ===');
  const res2 = await fetch(graftyUrl + '/api/v1/messages/send-template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + graftyKey, 'x-api-key': graftyKey },
    body: JSON.stringify({
      instance_id: graftyInstanceId,
      recipient: { phone: '919042583701', name: 'Stalin' },
      template: {
        name: 'grafty_common_template_all_industries',
        language: 'en',
        components: [{ type: 'header', parameters: [{ type: 'image', image: { link: sampleImage } }] }]
      }
    })
  });
  console.log('Result 2 (language en):', res2.status, await res2.text());

  console.log('\n=== TEST 3: Meta Direct Cloud API with Image Header ===');
  if (metaToken && metaPhoneId) {
    const res3 = await fetch(`https://graph.facebook.com/v19.0/${metaPhoneId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${metaToken}` },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: '919042583701',
        type: 'template',
        template: {
          name: 'grafty_common_template_all_industries',
          language: { code: 'en_US' },
          components: [{ type: 'header', parameters: [{ type: 'image', image: { link: sampleImage } }] }]
        }
      })
    });
    console.log('Result 3 (Meta Direct):', res3.status, await res3.text());
  } else {
    console.log('Meta Direct not configured');
  }
}

test().then(() => process.exit(0)).catch(e => console.error(e));
