require('dotenv').config({ path: '/root/garage/.env' });
const { prisma } = require('/root/garage/apps/api/dist/db');
const { decrypt } = require('/root/garage/apps/api/dist/settings/integrations.router');

async function testHandle() {
  const keys = await prisma.integrationKey.findMany({ where: { service: { in: ['WHATSAPP', 'META'] } } });
  let graftyKey = '', graftyUrl = 'https://grafty.pro', graftyInstanceId = '';
  for (const k of keys) {
    if (k.keyName === 'GRAFTY_API_KEY') graftyKey = decrypt(k.encryptedValue);
    if (k.keyName === 'GRAFTY_API_URL') graftyUrl = decrypt(k.encryptedValue);
    if (k.keyName === 'GRAFTY_INSTANCE_ID') graftyInstanceId = decrypt(k.encryptedValue);
  }

  const headerHandle = "https://scontent.whatsapp.net/v/t61.29466-34/719633934_1256828006528059_7342898372785317285_n.png?ccb=1-7&_nc_sid=8b1bef&_nc_ohc=efWWcxqoSIsQ7kNvwGlVAEG&_nc_oc=AdqrK9QSyEPO1lVR1acz3m4Y3cpxWAMFQHxLpFfQjQ5fdaZzl8S5DVcnC0_nvhOou-U&_nc_zt=3&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&_nc_gid=Yx9IAnyyOgb6iTpRKAgrEA&_nc_tpa=Q5bMBQK_FkKViCXxHTKzejNZeZA-hBpWfwWIzRNsDXUKmTo9L7ZY05dMl15vm6egTFjYAtnz4tEHN8Mrjg&oh=01_Q5Aa5GkOiwdPbupThZ3BUcJkVS6Y0lfdQcIKEt8TXJwSjw0gQ&oe=6ACA671E";

  console.log('Testing with example header handle...');
  const p1 = {
    instance_id: graftyInstanceId,
    recipient: { phone: '919042583701', name: 'Stalin' },
    template: {
      name: 'grafty_common_template_all_industries',
      language: 'en_US',
      components: [
        { type: 'header', parameters: [{ type: 'image', image: { link: headerHandle } }] }
      ]
    }
  };
  const r1 = await fetch(graftyUrl + '/api/v1/messages/send-template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + graftyKey, 'x-api-key': graftyKey },
    body: JSON.stringify(p1)
  });
  console.log('Result Header Handle:', r1.status, await r1.text());

  console.log('Testing with button parameter...');
  const p2 = {
    instance_id: graftyInstanceId,
    recipient: { phone: '919042583701', name: 'Stalin' },
    template: {
      name: 'grafty_common_template_all_industries',
      language: 'en_US',
      components: [
        { type: 'header', parameters: [{ type: 'image', image: { link: headerHandle } }] },
        { type: 'button', sub_type: 'url', index: '0', parameters: [{ type: 'text', text: '' }] }
      ]
    }
  };
  const r2 = await fetch(graftyUrl + '/api/v1/messages/send-template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + graftyKey, 'x-api-key': graftyKey },
    body: JSON.stringify(p2)
  });
  console.log('Result Button Param:', r2.status, await r2.text());
}

testHandle().then(() => process.exit(0)).catch(e => console.error(e));
