const fs = require('fs');
const file = 'apps/web/app/agency/AgencyClient.tsx';
let content = fs.readFileSync(file, 'utf8');

// The incorrect insertion looks like:
/*
        })
            {(card.id === 'launchpad' || card.isLaunchpad) && (
               <UniversalLaunchpad allCards={cards || []} onSelect={(c: any) => {
                 // best effort select
                 window.dispatchEvent(new CustomEvent('selectCard', { detail: c.id }))
               }} />
            )}}
*/

// We need to move the launchpad condition INSIDE the map function, before the `</motion.div>` or `</div>` or whatever closing tag it was inside.
// Actually, it's easier to just remove the bad insertions and do them right.
content = content.replace(/\}\)\n            \{\(card\.id === 'launchpad' \|\| card\.isLaunchpad\) && \([\s\S]*?\}\} />\n            \)\}\}/g, '})');

// We also need to find any other malformed insertions. Let's just restore the file from git, and then re-apply ONLY the ServiceDetailsSection and other good changes using a script, or just manually fix the JSX.
