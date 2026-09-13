const fs = require('fs');
const file = 'apps/web/app/agency/AgencyClient.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. LayoutInfiniteCanvas
content = content.replace(
  /className="absolute w-\[85vw\] md:w-\[450px\]/g,
  'className={`absolute w-[85vw] ${(card.id === \\\'cost_calculator\\\' || card.isCostCalculator) ? \\\'md:w-[1000px]\\\' : \\\'md:w-[450px]\\\'}`'
);
// Fix the static string to template literal
content = content.replace(
  /className=\{`absolute w-\[85vw\] \$\{\(card.id === 'cost_calculator' \|\| card.isCostCalculator\) \? 'md:w-\[1000px\]' : 'md:w-\[450px\]'\}\`\} bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-zinc-200 pointer-events-auto flex flex-col cursor-grab active:cursor-grabbing hover:z-50 hover:shadow-2xl transition-shadow"/g,
  'className={`absolute w-[85vw] ${(card.id === \'cost_calculator\' || card.isCostCalculator) ? \'md:w-[1000px]\' : \'md:w-[450px]\'} bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-zinc-200 pointer-events-auto flex flex-col cursor-grab active:cursor-grabbing hover:z-50 hover:shadow-2xl transition-shadow`}'
);

// 2. LayoutDigitalGallery
content = content.replace(
  /className="shrink-0 w-\[80vw\] md:w-\[500px\] flex flex-col items-center group"/g,
  'className={`shrink-0 w-[80vw] ${(card.id === \'cost_calculator\' || card.isCostCalculator) ? \'md:w-[1000px]\' : \'md:w-[500px]\'} flex flex-col items-center group`}'
);

// 3. LayoutPaperCraft - change columns to grid
content = content.replace(
  /className="max-w-7xl mx-auto p-6 md:p-12 py-12 columns-1 md:columns-2 lg:columns-3 gap-8 md:gap-12 space-y-8 md:space-y-12"/g,
  'className="max-w-7xl mx-auto p-6 md:p-12 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"'
);
content = content.replace(
  /className="break-inside-avoid relative p-6 md:p-10/g,
  'className={`relative p-6 md:p-10 ${(card.id === \'cost_calculator\' || card.isCostCalculator) ? \'md:col-span-2 lg:col-span-3\' : \'\'}`'
);
// We need to fix the template literal merging here too
content = content.replace(
  /className=\{`relative p-6 md:p-10 \$\{\(card.id === 'cost_calculator' \|\| card.isCostCalculator\) \? 'md:col-span-2 lg:col-span-3' : ''\}\`\} bg-white shadow-\[2px_4px_15px_rgba\(0,0,0,0\.05\)\] transform transition-transform hover:scale-105 hover:-rotate-1"/g,
  'className={`relative p-6 md:p-10 ${(card.id === \'cost_calculator\' || card.isCostCalculator) ? \'md:col-span-2 lg:col-span-3\' : \'\'} bg-white shadow-[2px_4px_15px_rgba(0,0,0,0.05)] transform transition-transform hover:scale-105 hover:-rotate-1`}'
);

fs.writeFileSync(file, content);
console.log('Fixed layouts!');
