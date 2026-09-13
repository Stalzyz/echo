const { prisma } = require('/root/garage/apps/api/dist/db');
const { decrypt } = require('/root/garage/apps/api/dist/settings/integrations.router');

async function test() {
  const keys = await prisma.integrationKey.findMany({ where: { service: { in: ['WHATSAPP', 'META'] } } });
  let graftyKey = '', graftyUrl = 'https://grafty.pro', metaToken = '', metaPhoneNumberId = '';
  for (const k of keys) {
    if (k.keyName === 'GRAFTY_API_KEY') graftyKey = decrypt(k.encryptedValue);
    if (k.keyName === 'GRAFTY_API_URL') graftyUrl = decrypt(k.encryptedValue);
  }

  const commonHandle = 'https://scontent.whatsapp.net/v/t61.29466-34/719633934_1256828006528059_7342898372785317285_n.png?ccb=1-7&_nc_sid=8b1bef&_nc_ohc=efWWcxqoSIsQ7kNvwGlVAEG&_nc_oc=AdqrK9QSyEPO1lVR1acz3m4Y3cpxWAMFQHxLpFfQjQ5fdaZzl8S5DVcnC0_nvhOou-U&_nc_zt=3&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&_nc_gid=Yx9IAnyyOgb6iTpRKAgrEA&_nc_tpa=Q5bMBQK_FkKViCXxHTKzejNZeZA-hBpWfwWIzRNsDXUKmTo9L7ZY05dMl15vm6egTFjYAtnz4tEHN8Mrjg&oh=01_Q5Aa5gGkOiwdPbupThZ3BUcJkVS6Y0lfdQcIKEt8TXJwSjw0gQ&oe=6ACA671E';

  console.log('--- Testing grafty_common_template_all_industries with header image ---');
  const res = await fetch(graftyUrl + '/api/v1/messages/send-template', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + graftyKey,
      'x-api-key': graftyKey
    },
    body: JSON.stringify({
      recipient: { phone: '919042583701', name: 'Stalin' },
      template: {
        name: 'grafty_common_template_all_industries',
        language: 'en_US',
        components: [
          {
            type: 'header',
            parameters: [
              { type: 'image', image: { link: commonHandle } }
            ]
          }
        ]
      }
    })
  });
  console.log('Status:', res.status, await res.text());
}

test().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
