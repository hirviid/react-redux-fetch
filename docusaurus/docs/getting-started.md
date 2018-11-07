---
id: getting-started
title: Getting Started
---

React Redux Fetch provides a declarative way to interact with a back-end in React components. React Redux Fetch dispatches actions for every request and response (either fulfilled or rejected) and stores the response data and metadata in the Redux state.

React Redux Fetch aims to keep your data source declarations close to your components, without having to put too much logic in dumb components to make the actual API call. By integrating with Redux, you don't loose the possibility to have your data available everywhere you need it. It's easier to debug, and easier to handle side effects (e.g. with redux-saga).

## Installation

```sh
npm install --save react-redux-fetch
```

or

```sh
yarn add react-redux-fetch
```

## Setup

### 1. Add middleware

Connect the react-redux-fetch middleware to the Store using applyMiddleware:

```js
// configureStore.js

import { middleware as fetchMiddleware } from 'react-redux-fetch';
import { applyMiddleware, createStore } from 'redux';

const configureStore = (initialState, rootReducer) => {
  const middleware = [fetchMiddleware, otherMiddleware];

  const store = createStore(rootReducer, initialState, applyMiddleware(...middleware));

  return store;
};

export default configureStore;
```

### 2. Add reducer

Mount react-redux-fetch reducer to the state at repository:

```js
// rootReducer.js

import { combineReducers } from 'redux';
import { reducer as fetchReducer } from 'react-redux-fetch';

const rootReducer = combineReducers({
  // ... other reducers
  repository: fetchReducer,
});

export default rootReducer;
```
