require('dotenv').config({ path: '/root/garage/.env' });
const { prisma } = require('/root/garage/apps/api/dist/db');
const { decrypt } = require('/root/garage/apps/api/dist/settings/integrations.router');

async function testImageWays() {
  const keys = await prisma.integrationKey.findMany({ where: { service: { in: ['WHATSAPP', 'META'] } } });
  let graftyKey = '', graftyUrl = 'https://grafty.pro', graftyInstanceId = '';
  for (const k of keys) {
    if (k.keyName === 'GRAFTY_API_KEY') graftyKey = decrypt(k.encryptedValue);
    if (k.keyName === 'GRAFTY_API_URL') graftyUrl = decrypt(k.encryptedValue);
    if (k.keyName === 'GRAFTY_INSTANCE_ID') graftyInstanceId = decrypt(k.encryptedValue);
  }

  const sampleImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';

  // Check 1: uppercase HEADER
  console.log('--- 1. uppercase HEADER ---');
  const r1 = await fetch(graftyUrl + '/api/v1/messages/send-template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + graftyKey, 'x-api-key': graftyKey },
    body: JSON.stringify({
      instance_id: graftyInstanceId,
      recipient: { phone: '919042583701', name: 'Stalin' },
      template: {
        name: 'shopify_to_ecommerce',
        language: 'en_US',
        components: [
          {
            type: 'HEADER',
            parameters: [
              { type: 'IMAGE', image: { link: sampleImage } }
            ]
          }
        ]
      }
    })
  });
  console.log('1 status:', r1.status, await r1.text());

  // Check 2: mediaUrl at template level
  console.log('--- 2. mediaUrl at template level ---');
  const r2 = await fetch(graftyUrl + '/api/v1/messages/send-template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + graftyKey, 'x-api-key': graftyKey },
    body: JSON.stringify({
      instance_id: graftyInstanceId,
      recipient: { phone: '919042583701', name: 'Stalin' },
      template: {
        name: 'shopify_to_ecommerce',
        language: 'en_US',
        mediaUrl: sampleImage,
        media_url: sampleImage
      }
    })
  });
  console.log('2 status:', r2.status, await r2.text());

  // Check 3: header_handle
  const headerHandle = 'https://scontent.whatsapp.net/v/t61.29466-34/642678768_850317051240573_175361912867767487_n.png?ccb=1-7&_nc_sid=8b1bef&_nc_ohc=CDkvmhkUMagQ7kNvwHOX_8z&_nc_oc=AdpkwzbRCw6w_gB2AZwpW5bujnQJPnjqwa2bUEME4fDsQCFGQlEGamdYkYMK8CZ1swk&_nc_zt=3&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&_nc_gid=Yx9IAnyyOgb6iTpRKAgrEA&_nc_tpa=Q5bMBQIBsEJ3uz2kFVS9w82KRYo-ADZOtgqCFI3Yy_n7JlSehl2KpoAE-HV73ippszZqKBvSEfu-EU4psg&oh=01_Q5Aa5gF2O7PQ39GRKgCMNKLDJWxEZvcFRv8pcr6GD9Vm0bV2qQ&oe=6ACA58B0';
  console.log('--- 3. header_handle parameter ---');
  const r3 = await fetch(graftyUrl + '/api/v1/messages/send-template', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + graftyKey, 'x-api-key': graftyKey },
    body: JSON.stringify({
      instance_id: graftyInstanceId,
      recipient: { phone: '919042583701', name: 'Stalin' },
      template: {
        name: 'shopify_to_ecommerce',
        language: 'en_US',
        components: [
          {
            type: 'header',
            parameters: [
              { type: 'image', image: { handle: headerHandle } }
            ]
          }
        ]
      }
    })
  });
  console.log('3 status:', r3.status, await r3.text());
}

testImageWays().then(() => process.exit(0)).catch(e => console.error(e));
