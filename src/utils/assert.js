
export default {

    contains: (obj, prop, message) => {
        if (!obj.hasOwnProperty(prop)) {
            throw Error(message || `Required property ${prop} missing`);
        }
    },

    exists: (prop, message) => {
        if (!prop) {
            throw Error(message || ``);
        }
    }

}
