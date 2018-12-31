---
id: container
title: container
---

The container provides a single entry point into customizing the different parts of react-redux-fetch.

## Importing

```js
var container = require('react-redux-fetch').container; // ES5

import { container } from 'react-redux-fetch'; // ES6
```

## Usage

### **requestMethods**

Out-of-the-box, react-redux-refetch provides implementations for `get`, `post`, `put` and `delete` requests.
A new request method, e.g. `patch`, can be added like this:

```js
container.registerRequestMethod('patch', {
  method: 'patch', // The request method
  middleware: fetchRequest, // The middleware to handle the actual fetching. 'fetchRequest' from 'react-redux-fetch' is a sensible default for any request method.
  reducer: patchReducer,
});
```

An existing request method definition can be altered like this:

```js
// Replace middleware for POST requests with a mock
container.changeRequestMethodConfig('post', 'middleware', mockFetchMiddleware);
```

### **requestHeaders**

The default request headers are `'Accept': 'application/json'` and `'Content-Type': 'application/json'`. You can add request headers:

```js
container.registerRequestHeader('authorization', 'Bearer some.jwt.token');
```

Or replace the request headers:

```js
container.replaceRequestHeaders({ 'Content-Type', 'application/xml' });
```

### **reducers**

Additional reducers can be registered to work on a subset of the fetch state, without having to overwrite all reducers defined in requestMethods definition.
For example, there is no out-of-the-box way of clearing state data. If you want to clear e.g. all todo items from a todo list, you can register a reducer to work on the 'todos' state.

```js
container.registerReducer('todos', todosReducer);
```

The todos state slice is passed to the reducer, which can return a new state when your custom redux action is dispatched:

```js
function todosReducer(state, action) {
  switch (action.type) {
    case 'TODOS_RESET':
      return state.set('value', null);
  }
  return state;
}
```

### **requestBuilder**

The requestBuilder is used by the default react-redux-fetch middleware. Takes a URL and request config and returns a Request object.
To replace the default implementation:

```js
container.getDefinition('requestBuilder').replaceArgument('build', customRequestBuilder);
```

### **utils**

The following small utility functions used throughout the code can be overwritten as well:

```js
container.setUtil('equals', customEqualsFn);
container.setUtil('handleResponse', customResponseHandlerFn);
container.setUtil('componentHelpers', customComponentHelpers);
```
