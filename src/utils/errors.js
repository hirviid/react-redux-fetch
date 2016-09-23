const parse = (cause) => {
  const error = cause.error;
  const message = cause.message;

  if (error) {
    return error;
  } else if (message) {
    return message;
  }
  return '';
};

const newError = (cause) => {
  const e = new Error(parse(cause));
  e.cause = cause;
  return e;
};

export default newError;
