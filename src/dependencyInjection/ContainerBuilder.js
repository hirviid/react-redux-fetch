import {Definition} from './Definition';

class ContainerBuilder {

    definitions = {};

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
    register(id, obj) {
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
    setDefinition(id, definition) {
        id = id.toLowerCase();
        this.definitions[id] = definition;
        return definition;
    }

    /**
     * Gets a service definition.
     *
     * @param {String} id The service identifier
     *
     * @return {Definition} A Definition instance
     */
    getDefinition(id) {
        id = id.toLowerCase();
        if (!this.hasDefinition(id)) {
            throw new Error(`Service ${id} not found`);
        }
        return this.definitions[id];
    }

    /**
     * @param {String} id The service identifier
     *
     * @return {boolean} True if container contains definition
     */
    hasDefinition(id) {
        id = id.toLowerCase();
        return this.definitions.hasOwnProperty(id);
    }

}

export default ContainerBuilder;
