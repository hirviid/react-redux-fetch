export default {
  contains: (obj, prop, message) => {
    if (!obj[prop]) {
      throw Error(message || `Required property ${prop} missing`);
    }
  },
  exists: (prop, message) => {
    if (!prop) {
      throw Error(message || '');
    }
  },
};
