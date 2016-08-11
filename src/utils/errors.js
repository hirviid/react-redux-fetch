const newError = (cause) => {
    let e = new Error(parse(cause));
    e.cause = cause;
    return e;
};

const parse = (cause) => {
    let error = cause.error;
    let message = cause.message;

    if (error) {
        return error;
    } else if (message) {
        return message;
    } else {
        return '';
    }
};

export default newError;
