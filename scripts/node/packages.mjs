import fs from 'fs/promises';
import path from 'path';

export class Packages {
  constructor(packages) {
    this.packages = packages;
  }

  addPackage(pkg) {
    this.packages.push(pkg);
  }

  async clean(shouldCleanNodeModules = false) {
    await Promise.all(this.packages.map((pkg) => pkg.clean(shouldCleanNodeModules)));
  }
}

export class Package {
  constructor(name, relativePath) {
    this.name = name;
    this.relativePath = relativePath;
  }

  async removeItem(name) {
    const itemRelativePath = path.join(this.relativePath, name);
    try {
      const itemPath = path.resolve(process.cwd(), itemRelativePath);
      await fs.rm(itemPath, { recursive: true });
      console.log(`✓ ${itemRelativePath} is REMOVED`);
    } catch (err) {
      console.log(`✗ ${itemRelativePath} FAILED to remove`);
    }
  }

  async clean(shouldCleanNodeModules = false) {
    if (shouldCleanNodeModules) {
      await this.removeItem('node_modules');
    }

    await this.removeItem('yarn.lock');
    await this.removeItem('tsconfig.lib.json');
  }
}

export async function resolvePackages() {
  const packagesPath = path.join('.', 'packages');

  const pkgs = (await fs.readdir(packagesPath, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .map((name) => new Package(name, path.join(packagesPath, name)));

  const packages = new Packages(pkgs);
  packages.addPackage(new Package('root', ''));
  packages.addPackage(new Package('cypress-test-setup', 'cypress/test-setup'));

  return packages;
}
