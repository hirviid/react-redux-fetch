export default (response) => {
  if (!response) {
    return {};
  }

  const responseObj = {
    headers: {},
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
  };

  if (response.headers.entries) {
    const gen = response.headers.entries();

    let header = null;
    do {
      header = gen.next();
      if (header.value) {
        responseObj.headers[header.value[0]] = header.value[1];
      }
    }
    while (header.done === false);
  }

  return responseObj;
};
