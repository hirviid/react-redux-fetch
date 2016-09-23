// @flow
import { assign } from '../utils/assign';

export default class Definition {

  args:Object = {};

  constructor(args: Object = {}) {
    this.args = args;
  }

  /**
   * Sets a specific argument
   * @param {String} path The path in args to the value that you want to replace
   * @param {any} arg The value to set
   * @return {Definition} The current instance
   */
  replaceArgument(path: string, arg: any) : Definition {
    assign(this.args, path, arg);
    return this;
  }

  /**
   * Adds an argument
   *
   * @param {String} key The key to use
   * @param {any} arg An argument
   * @return {Definition} The current instance
   */
  addArgument(key: string, arg: any) : Definition {
    this.args[key] = arg;
    return this;
  }

  /**
   * @return {Object} The object of arguments
   */
  getArguments() : Object {
    return this.args;
  }

  /**
   * @param {String} key The key of the argument to return
   * @return {any} The argument
   */
  getArgument(key:string): any {
    if (!this.args[key]) {
      throw new Error(`key ${key} not found in args.`);
    }
    return this.args[key];
  }

}
