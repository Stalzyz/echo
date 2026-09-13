const fs = require('fs');
const file = 'apps/web/app/agency/AgencyClient.tsx';
let content = fs.readFileSync(file, 'utf8');

const badSnippet = `            {(card.id === 'launchpad' || card.isLaunchpad) && (
               <UniversalLaunchpad allCards={cards || []} onSelect={(c: any) => {
                 // best effort select
                 window.dispatchEvent(new CustomEvent('selectCard', { detail: c.id }))
               }} />
            )}}`;

// We just replace that bad snippet with `            })`
content = content.replace(new RegExp(badSnippet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '            })');

fs.writeFileSync(file, content);
console.log('Fixed syntax!');
