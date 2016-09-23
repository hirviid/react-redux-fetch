import { assign } from '../utils/assign';

export default class Definition {

  constructor(args = {}) {
    this.args = args;
  }

  /**
   * Sets a specific argument
   * @param {String} path The path in args to the value that you want to replace
   * @param {*} arg The value to set
   * @return {Definition} The current instance
   */
  replaceArgument(path, arg) {
    assign(this.args, path, arg);
    return this;
  }

  /**
   * Adds an argument
   *
   * @param {String} key The key to use
   * @param {*} arg An argument
   * @return {Definition} The current instance
   */
  addArgument(key, arg) {
    this.args[key] = arg;
    return this;
  }

  /**
   * @return {{}} The object of arguments
   */
  getArguments() {
    return this.args;
  }

  /**
   * @param {String} key The key of the argument to return
   * @return {*} The argument
   */
  getArgument(key) {
    if (!this.args[key]) {
      throw new Error(`key ${key} not found in args.`);
    }
    return this.args[key];
  }

}
