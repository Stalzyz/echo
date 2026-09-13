const fs = require('fs');
let patch = fs.readFileSync('my_agency.patch', 'utf8');

// We want to keep everything in the patch EXCEPT the bad Launchpad injections inside LayoutInfiniteCanvas, LayoutCinematic, and LayoutCreativeUniverse.
// Those injections happen around line 2370, 2598, 2798.
// The easiest way is to let the patch apply, and then fix the file with node afterwards, but we can't because patch might reject it or we end up with syntax errors.
// Wait, the patch has the exact bad syntax.
// Let's just remove the hunk that contains `window.dispatchEvent(new CustomEvent('selectCard'` from the patch!
// Actually, `patch` applies hunks independently. We can just use `sed` to edit the patch file?
