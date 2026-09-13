require('dotenv').config({ path: '/root/garage/.env' });
const { prisma } = require('/root/garage/apps/api/dist/db');
const { decrypt } = require('/root/garage/apps/api/dist/settings/integrations.router');

async function check() {
  const keys = await prisma.integrationKey.findMany({ where: { service: { in: ['WHATSAPP', 'META'] } } });
  let graftyKey = '', graftyUrl = 'https://grafty.pro', metaToken = '', metaWabaId = '';
  for (const k of keys) {
    if (k.keyName === 'GRAFTY_API_KEY') graftyKey = decrypt(k.encryptedValue);
    if (k.keyName === 'GRAFTY_API_URL') graftyUrl = decrypt(k.encryptedValue);
    if (k.keyName === 'META_ACCESS_TOKEN') metaToken = decrypt(k.encryptedValue);
    if (k.keyName === 'META_WABA_ID') metaWabaId = decrypt(k.encryptedValue);
  }

  const res = await fetch(`${graftyUrl}/api/v1/templates`, { headers: { Authorization: `Bearer ${graftyKey}`, 'x-api-key': graftyKey } });
  const data = await res.json();
  const items = Array.isArray(data) ? data : (data.data || []);
  const shopify = items.filter(t => (t.name || '').toLowerCase().includes('shopify') || (t.id || '').toLowerCase().includes('shopify') || (t.name || '').toLowerCase().includes('ecommerce'));
  console.log('SHOPIFY TEMPLATES ON GRAFTY:');
  shopify.forEach(t => {
    console.log(JSON.stringify(t, null, 2));
  });
}
check().then(() => process.exit(0)).catch(e => console.error(e));
