require('dotenv').config({ path: '/root/garage/.env' });
const { prisma } = require('/root/garage/apps/api/dist/db');
const { decrypt } = require('/root/garage/apps/api/dist/settings/integrations.router');

async function diffTemplates() {
  const keys = await prisma.integrationKey.findMany({ where: { service: { in: ['WHATSAPP', 'META'] } } });
  let graftyKey = '', graftyUrl = 'https://grafty.pro';
  for (const k of keys) {
    if (k.keyName === 'GRAFTY_API_KEY') graftyKey = decrypt(k.encryptedValue);
    if (k.keyName === 'GRAFTY_API_URL') graftyUrl = decrypt(k.encryptedValue);
  }

  const res = await fetch(`${graftyUrl}/api/v1/templates`, { headers: { Authorization: `Bearer ${graftyKey}`, 'x-api-key': graftyKey } });
  const data = await res.json();
  const items = Array.isArray(data) ? data : (data.data || []);

  const targets = ['grafty_welcome', 'quick_call', 'grafty_proposals', 'shopify_to_ecommerce'];
  targets.forEach(tName => {
    const t = items.find(x => x.name === tName);
    console.log(`\n=================== ${tName} ===================`);
    console.log(JSON.stringify(t, null, 2));
  });
}

diffTemplates().then(() => process.exit(0)).catch(e => console.error(e));
