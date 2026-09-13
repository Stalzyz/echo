require('dotenv').config({ path: '/root/garage/.env' });
const { prisma } = require('/root/garage/apps/api/dist/db');
const { decrypt } = require('/root/garage/apps/api/dist/settings/integrations.router');

async function test() {
  const keys = await prisma.integrationKey.findMany({ where: { service: { in: ['WHATSAPP', 'META'] } } });
  let graftyKey = '', graftyUrl = 'https://grafty.pro', graftyInstanceId = '';
  for (const k of keys) {
    if (k.keyName === 'GRAFTY_API_KEY') graftyKey = decrypt(k.encryptedValue);
    if (k.keyName === 'GRAFTY_API_URL') graftyUrl = decrypt(k.encryptedValue);
    if (k.keyName === 'GRAFTY_INSTANCE_ID') graftyInstanceId = decrypt(k.encryptedValue);
  }

  const realImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';

  console.log('\n=== REAL IMAGE TEST (grafty_common_template_all_industries) ===');
  const payload = {
    instance_id: graftyInstanceId,
    recipient: { phone: '919042583701', name: 'Stalin' },
    template: {
      name: 'grafty_common_template_all_industries',
      language: 'en_US',
      components: [
        {
          type: 'header',
          parameters: [
            { type: 'image', image: { link: realImage } }
          ]
        }
      ]
    },
    media_url: realImage
  };

  const res = await fetch(graftyUrl + '/api/v1/messages/send-template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + graftyKey, 'x-api-key': graftyKey },
    body: JSON.stringify(payload)
  });
  console.log('Result Real Image -> Status:', res.status, await res.text());
}

test().then(() => process.exit(0)).catch(e => console.error(e));
