type Cause = {
  error?: string;
  message?: string;
};

const parse = (cause: Cause) => {
  const error = cause.error;
  const message = cause.message;

  if (error) {
    return error;
  } else if (message) {
    return message;
  }
  return '';
};

const newError = (cause: Cause) => {
  const e = new Error(parse(cause));
  // @ts-ignore
  e.cause = cause;
  return e;
};

export default newError;
