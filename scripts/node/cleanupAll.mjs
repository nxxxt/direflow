import { Args } from './args.mjs';
import { resolvePackages } from './packages.mjs';

(async () => {
  const args = new Args();
  const packages = await resolvePackages();
  await packages.clean(args.has('--modules'));
})();
