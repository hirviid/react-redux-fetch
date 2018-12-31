---
id: build-actions-from-mappings
title: buildActionsFromMappings
---

You can use react-redux-fetch outside react components. For example in a Redux Saga.

## Importing

```js
var buildActionsFromMappings = require('react-redux-fetch').buildActionsFromMappings; // ES5

import { buildActionsFromMappings } from 'react-redux-fetch'; // ES6
```

## Usage

```js
const actions = buildActionsFromMappings([
  {
    resource: 'todos',
    request: {
      url: apiRoutes.getTodos(),
    },
  },
]);

store.dispatch(actions.todosGet());
```
