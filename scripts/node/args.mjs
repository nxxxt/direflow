export class Args {
  constructor() {
    this._args = process.argv.slice(2);
  }

  has(arg) {
    return this._args.indexOf(arg) !== -1;
  }
}
