const fs = require('fs');
const file = 'apps/web/app/agency/AgencyClient.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add UniversalLaunchpad component definition before LayoutCreativeOS
const launchpadCode = `
const UniversalLaunchpad = ({ allCards, onSelect }: any) => {
  return (
    <div className="w-full flex-1 p-6 md:p-12 overflow-y-auto custom-scrollbar flex items-center justify-center bg-zinc-950 rounded-3xl border border-white/10 my-8 shadow-2xl">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 sm:gap-8 md:gap-12 w-full max-w-4xl mx-auto items-start justify-items-center">
        {allCards?.filter((c: any) => c.id !== 'launchpad').map((card: any) => (
          <button 
            key={card.id}
            onClick={() => { onSelect?.(card); }}
            className="flex flex-col items-center gap-3 group cursor-pointer w-20 md:w-24"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/10 group-hover:border-white/30 shadow-lg relative overflow-hidden" style={{ color: card.colorHex || '#fff' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: card.colorHex || '#fff' }} />
              <i className={\`\${card.icon || card.iconName} text-2xl md:text-3xl relative z-10\`} />
            </div>
            <span className="text-[10px] md:text-xs text-center font-mono font-bold text-white/70 group-hover:text-white line-clamp-2 leading-tight">
              {card.title || card.category}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
`;

if (!content.includes('UniversalLaunchpad')) {
  content = content.replace('const LayoutCreativeOS', launchpadCode + '\nconst LayoutCreativeOS');
}

// 2. Wrap WebsiteCostCalculator in a dark container in all layouts EXCEPT LayoutCreativeOS
// We can just replace all `<WebsiteCostCalculator />` with the wrapper, and then manually fix LayoutCreativeOS if needed.
// Actually, it's safer to just replace all instances globally.
const calcWrapper = `<div className="bg-[#090a0f] border border-white/10 rounded-[2rem] shadow-2xl w-full p-2 md:p-4 my-8 relative z-[999] overflow-hidden"><WebsiteCostCalculator /></div>`;
content = content.replace(/<WebsiteCostCalculator \/>/g, calcWrapper);

// 3. Inject Launchpad into all other themes
// Find places where cost calculator is checked, and add Launchpad right after it.
content = content.replace(/\{\(card\.id === 'cost_calculator' \|\| card\.isCostCalculator\) && \([\s\S]*?\}\)/g, match => {
  return match + `\n            {(card.id === 'launchpad' || card.isLaunchpad) && (
               <UniversalLaunchpad allCards={cards || []} onSelect={(c: any) => {
                 // best effort select
                 window.dispatchEvent(new CustomEvent('selectCard', { detail: c.id }))
               }} />
            )}`;
});

fs.writeFileSync(file, content);
