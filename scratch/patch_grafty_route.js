const { execSync } = require('child_process');
const fs = require('fs');

console.log('--- 1. Patching source file in /root/grafty_bsp ---');
const srcFile = '/root/grafty_bsp/app/api/v1/messages/send-template/route.ts';
if (fs.existsSync(srcFile)) {
  let src = fs.readFileSync(srcFile, 'utf8');
  if (src.includes('const components: any[] = [];')) {
    src = src.replace(
      'const components: any[] = [];',
      'const components: any[] = Array.isArray(template.components) && template.components.length > 0 ? [...template.components] : [];'
    );
    fs.writeFileSync(srcFile, src);
    console.log('Successfully patched source route.ts');
  } else {
    console.log('Pattern not found in source route.ts (or already patched)');
  }
}

console.log('--- 2. Patching compiled route.js inside docker container ---');
const container = 'grafty_bsp-web-1';
const routeInContainer = '/app/.next/server/app/api/v1/messages/send-template/route.js';

execSync(`docker exec ${container} cp ${routeInContainer} ${routeInContainer}.bak`);
let compiled = execSync(`docker exec ${container} cat ${routeInContainer}`).toString();

if (compiled.includes('let d=[];')) {
  compiled = compiled.replace(
    'let d=[];',
    'let d=Array.isArray(c.components)&&c.components.length>0?[...c.components]:[];'
  );
  fs.writeFileSync('/tmp/patched_route.js', compiled);
  execSync(`docker cp /tmp/patched_route.js ${container}:${routeInContainer}`);
  console.log('Successfully patched compiled route.js inside container!');
} else if (compiled.includes('Array.isArray(c.components)')) {
  console.log('Compiled route.js is already patched!');
} else {
  console.log('let d=[]; not found in compiled route.js');
}

console.log('--- 3. Restarting container to pick up changes ---');
execSync(`docker restart ${container}`);
console.log('Container restarted successfully!');
