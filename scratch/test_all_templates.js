require('dotenv').config({ path: '/root/garage/.env' });
const { prisma } = require('/root/garage/apps/api/dist/db');
const { decrypt } = require('/root/garage/apps/api/dist/settings/integrations.router');

async function testAll() {
  const keys = await prisma.integrationKey.findMany({ where: { service: { in: ['WHATSAPP', 'META'] } } });
  let graftyKey = '', graftyUrl = 'https://grafty.pro', graftyInstanceId = '';
  for (const k of keys) {
    if (k.keyName === 'GRAFTY_API_KEY') graftyKey = decrypt(k.encryptedValue);
    if (k.keyName === 'GRAFTY_API_URL') graftyUrl = decrypt(k.encryptedValue);
    if (k.keyName === 'GRAFTY_INSTANCE_ID') graftyInstanceId = decrypt(k.encryptedValue);
  }

  const realImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';

  const templatesToTest = [
    'grafty_welcome',
    'quick_call',
    'grafty_proposals',
    'grafty_image_proposal',
    'grafty_common_template_all_industries',
    'grafty_partnership_intro',
    'ecommerce_webdevelopment',
    'urban_cart',
    'grafty_demo'
  ];

  for (const name of templatesToTest) {
    // Try with image header
    const p1 = {
      instance_id: graftyInstanceId,
      recipient: { phone: '919042583701', name: 'Stalin' },
      template: {
        name,
        language: 'en_US',
        components: [
          { type: 'header', parameters: [{ type: 'image', image: { link: realImage } }] }
        ]
      }
    };
    const r1 = await fetch(graftyUrl + '/api/v1/messages/send-template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + graftyKey, 'x-api-key': graftyKey },
      body: JSON.stringify(p1)
    });
    const t1 = await r1.text();

    // Try without header
    const p2 = {
      instance_id: graftyInstanceId,
      recipient: { phone: '919042583701', name: 'Stalin' },
      template: {
        name,
        language: 'en_US',
        components: []
      }
    };
    const r2 = await fetch(graftyUrl + '/api/v1/messages/send-template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + graftyKey, 'x-api-key': graftyKey },
      body: JSON.stringify(p2)
    });
    const t2 = await r2.text();

    console.log(`\nTemplate: ${name}`);
    console.log(`  With Image Header -> Status ${r1.status}: ${t1.slice(0, 120)}`);
    console.log(`  Without Header    -> Status ${r2.status}: ${t2.slice(0, 120)}`);
  }
}

testAll().then(() => process.exit(0)).catch(e => console.error(e));
