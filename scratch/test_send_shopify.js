require('dotenv').config({ path: '/root/garage/.env' });
const { prisma } = require('/root/garage/apps/api/dist/db');
const { decrypt } = require('/root/garage/apps/api/dist/settings/integrations.router');

async function testShopify2() {
  const keys = await prisma.integrationKey.findMany({ where: { service: { in: ['WHATSAPP', 'META'] } } });
  let graftyKey = '', graftyUrl = 'https://grafty.pro', graftyInstanceId = '';
  for (const k of keys) {
    if (k.keyName === 'GRAFTY_API_KEY') graftyKey = decrypt(k.encryptedValue);
    if (k.keyName === 'GRAFTY_API_URL') graftyUrl = decrypt(k.encryptedValue);
    if (k.keyName === 'GRAFTY_INSTANCE_ID') graftyInstanceId = decrypt(k.encryptedValue);
  }

  const headerHandle = 'https://scontent.whatsapp.net/v/t61.29466-34/642678768_850317051240573_175361912867767487_n.png?ccb=1-7&_nc_sid=8b1bef&_nc_ohc=CDkvmhkUMagQ7kNvwHOX_8z&_nc_oc=AdpkwzbRCw6w_gB2AZwpW5bujnQJPnjqwa2bUEME4fDsQCFGQlEGamdYkYMK8CZ1swk&_nc_zt=3&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&_nc_gid=Yx9IAnyyOgb6iTpRKAgrEA&_nc_tpa=Q5bMBQIBsEJ3uz2kFVS9w82KRYo-ADZOtgqCFI3Yy_n7JlSehl2KpoAE-HV73ippszZqKBvSEfu-EU4psg&oh=01_Q5Aa5gF2O7PQ39GRKgCMNKLDJWxEZvcFRv8pcr6GD9Vm0bV2qQ&oe=6ACA58B0';

  console.log('--- TEST A: Quick reply button payload + image header ---');
  const rA = await fetch(graftyUrl + '/api/v1/messages/send-template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + graftyKey, 'x-api-key': graftyKey },
    body: JSON.stringify({
      instance_id: graftyInstanceId,
      recipient: { phone: '919042583701', name: 'Stalin' },
      template: {
        name: 'shopify_to_ecommerce',
        language: 'en_US',
        components: [
          { type: 'header', parameters: [{ type: 'image', image: { link: headerHandle } }] },
          { type: 'button', sub_type: 'quick_reply', index: '0', parameters: [{ type: 'payload', payload: 'check_eligibility' }] }
        ]
      }
    })
  });
  console.log('Test A status:', rA.status, await rA.text());

  console.log('--- TEST B: Quick reply button only (no header) ---');
  const rB = await fetch(graftyUrl + '/api/v1/messages/send-template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + graftyKey, 'x-api-key': graftyKey },
    body: JSON.stringify({
      instance_id: graftyInstanceId,
      recipient: { phone: '919042583701', name: 'Stalin' },
      template: {
        name: 'shopify_to_ecommerce',
        language: 'en_US',
        components: [
          { type: 'button', sub_type: 'quick_reply', index: '0', parameters: [{ type: 'payload', payload: 'check_eligibility' }] }
        ]
      }
    })
  });
  console.log('Test B status:', rB.status, await rB.text());

  console.log('--- TEST C: grafty_for_shopify (The OTHER Shopify template) ---');
  const rC = await fetch(graftyUrl + '/api/v1/messages/send-template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + graftyKey, 'x-api-key': graftyKey },
    body: JSON.stringify({
      instance_id: graftyInstanceId,
      recipient: { phone: '919042583701', name: 'Stalin' },
      template: {
        name: 'grafty_for_shopify',
        language: 'en_US',
        components: []
      }
    })
  });
  console.log('Test C status:', rC.status, await rC.text());

  console.log('--- TEST D: ecommerce_start ---');
  const rD = await fetch(graftyUrl + '/api/v1/messages/send-template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + graftyKey, 'x-api-key': graftyKey },
    body: JSON.stringify({
      instance_id: graftyInstanceId,
      recipient: { phone: '919042583701', name: 'Stalin' },
      template: {
        name: 'ecommerce_start',
        language: 'en_US',
        components: []
      }
    })
  });
  console.log('Test D status:', rD.status, await rD.text());
}

testShopify2().then(() => process.exit(0)).catch(e => console.error(e));
