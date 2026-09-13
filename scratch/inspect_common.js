require('dotenv').config({ path: '/root/garage/.env' });
require('dotenv').config({ path: '/root/garage/apps/api/.env' });
const { prisma } = require('/root/garage/apps/api/dist/db');
const { decrypt } = require('/root/garage/apps/api/dist/settings/integrations.router');

async function run() {
  const keys = await prisma.integrationKey.findMany({ where: { service: { in: ['WHATSAPP', 'META'] } } });
  let graftyKey = '', graftyUrl = 'https://grafty.pro', metaToken = '', metaWabaId = '';
  for (const k of keys) {
    if (k.keyName === 'GRAFTY_API_KEY') graftyKey = decrypt(k.encryptedValue);
    if (k.keyName === 'GRAFTY_API_URL') graftyUrl = decrypt(k.encryptedValue);
    if (k.keyName === 'META_ACCESS_TOKEN') metaToken = decrypt(k.encryptedValue);
    if (k.keyName === 'META_WABA_ID') metaWabaId = decrypt(k.encryptedValue);
  }

  if (graftyKey) {
    const res = await fetch(`${graftyUrl}/api/v1/templates`, { headers: { Authorization: `Bearer ${graftyKey}`, 'x-api-key': graftyKey } });
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data.data || []);
    console.log('--- ALL TEMPLATES ON GRAFTY ---');
    items.forEach(t => console.log(t.name, '| lang:', t.language, '| category:', t.category, '| components:', JSON.stringify(t.components)));
  }

  if (metaToken && metaWabaId) {
    const res = await fetch(`https://graph.facebook.com/v19.0/${metaWabaId}/message_templates?limit=100&access_token=${metaToken}`);
    const data = await res.json();
    console.log('\n--- ALL TEMPLATES ON META ---');
    (data.data || []).forEach(t => console.log(t.name, '| lang:', t.language, '| status:', t.status, '| components:', JSON.stringify(t.components)));
  }
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
