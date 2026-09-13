const fs = require('fs');
const file = 'apps/web/app/agency/AgencyClient.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = '<WebsiteCostCalculator /></div>';
const replacement = `<WebsiteCostCalculator /></div>
                     {(card.id === 'launchpad' || card.isLaunchpad) && (
                        <div className="w-full mt-8">
                           <UniversalLaunchpad allCards={cards || []} onSelect={(c: any) => window.dispatchEvent(new CustomEvent('selectCard', { detail: c.id }))} />
                        </div>
                     )}`;

// We replace all instances
content = content.split(target).join(replacement);

fs.writeFileSync(file, content);
console.log('Added launchpad!');
