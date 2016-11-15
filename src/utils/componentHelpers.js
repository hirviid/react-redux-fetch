const fetchIsFulfilled = (prevProps, nextProps) =>
  prevProps.pending && nextProps.fulfilled;

export default {
  fetchIsFulfilled,
};
