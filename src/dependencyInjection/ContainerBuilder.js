// @flow
import Definition from './Definition';

class ContainerBuilder {

  definitions:Object = {};

  /**
   * Registers a service definition.
   *
   * This methods allows for simple registration of service definition
   * with a fluid interface.
   *
   * @param {String} id    The service identifier
   * @param {Object} obj   The service configuration object
   *
   * @return {Definition} A Definition instance
   */
  register(id:string, obj:Object): Definition {
    return this.setDefinition(id, new Definition(obj));
  }

  /**
   * Sets a service definition.
   *
   * @param {String}     id         The service identifier
   * @param {Definition} definition A Definition instance
   *
   * @return {Definition} the service definition
   */
  setDefinition(id: string, definition: Definition): Definition {
    const finalId = id.toLowerCase();
    this.definitions[finalId] = definition;
    return definition;
  }

  /**
   * Gets a service definition.
   *
   * @param {String} id The service identifier
   *
   * @return {Definition} A Definition instance
   */
  getDefinition(id:string): Definition {
    const finalId = id.toLowerCase();
    if (!this.hasDefinition(finalId)) {
      throw new Error(`Service ${finalId} not found`);
    }
    return this.definitions[finalId];
  }

  /**
   * @param {String} id The service identifier
   *
   * @return {boolean} True if container contains definition
   */
  hasDefinition(id:string): boolean {
    const finalId = id.toLowerCase();
    return !!this.definitions[finalId];
  }

}

export default ContainerBuilder;
