const fetchIsFulfilled = (prevProps, nextProps, resource) =>
  prevProps[`${resource}Fetch`] &&
  nextProps[`${resource}Fetch`] &&
  prevProps[`${resource}Fetch`].pending &&
  nextProps[`${resource}Fetch`].fulfilled;

export default {
  fetchIsFulfilled,
};
