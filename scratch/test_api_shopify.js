const { WhatsAppService } = require('/root/grekam-os/apps/api/dist/integrations/whatsapp.service');
const service = new WhatsAppService();

async function test() {
  console.log('Testing sendTemplateMessage for shopify_to_ecommerce without user mediaUrl...');
  const res = await service.sendTemplateMessage({
    phone: '919042583701',
    name: 'Stalin',
    event: 'CRM_LEAD_FOLLOWUP',
    templateName: 'shopify_to_ecommerce',
    variables: []
  });
  console.log('Result:', JSON.stringify(res, null, 2));
}

test().then(() => process.exit(0)).catch(e => { console.error('Error:', e.message); process.exit(1); });
