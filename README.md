# React Redux Fetch

A declarative and customizable way to fetch data for React components and manage that data in the Redux state.

<!--
[![build status](https://img.shields.io/travis/hirviid/react-redux-fetch/next.svg?style=flat-square)](https://travis-ci.org/hirviid/react-redux-fetch)
[![Codecov](https://img.shields.io/codecov/c/github/hirviid/react-redux-fetch/next.svg?style=flat-square)](https://travis-ci.org/hirviid/react-redux-fetch)
-->

@react-redux-fetch/core 

[![npm version](https://img.shields.io/npm/v/@react-redux-fetch/core.svg?style=flat-square)](https://www.npmjs.com/package/@react-redux-fetch/core) 

@react-redux-fetch/hooks

[![npm version](https://img.shields.io/npm/v/@react-redux-fetch/hooks.svg?style=flat-square)](https://www.npmjs.com/package/@react-redux-fetch/hooks) 

## v0 Documentation

- [Getting started](http://hirviid.github.io/react-redux-fetch/docs/getting-started)
- [API](http://hirviid.github.io/react-redux-fetch/docs/redux-fetch-config)
- [Examples](http://hirviid.github.io/react-redux-fetch/docs/examples)

## v1 Documentation

### Examples

- [CodeSandbox: Simple GET example](https://codesandbox.io/s/react-redux-fetch-hooks-simple-get-os7wf)
- [CodeSandbox: Simple GET example (with TypeScript)](https://codesandbox.io/s/react-redux-fetch-hooks-simple-get-ts-b11bs)
- [CodeSandbox: Simple POST example](https://codesandbox.io/s/react-redux-fetch-simple-post-g1u0r)

### Installation

```
npm install --save @react-redux-fetch/core @react-redux-fetch/hooks @react-redux-fetch/fetch-request-handler

yarn add @react-redux-fetch/core @react-redux-fetch/hooks @react-redux-fetch/fetch-request-handler
```

### Setup

1. Connect the react-redux-fetch middleware to the Store using `applyMiddleware`:

   ```js
   // ...
   import { createStore, applyMiddleware } from 'redux';
   import { fetchMiddleware } from '@react-redux-fetch/core';
   import { createFetchRequestHandler } from '@react-redux-fetch/fetch-request-handler';
   // ...

   const store = createStore(
     reducer,
     composeEnhancers(
       applyMiddleware(
         fetchMiddleware({
           requestHandler: createFetchRequestHandler(),
         })
       )
     )
   );

   // rest unchanged
   ```

2. Add react-redux-fetch reducers to your application's root reducer:

   ```js
   import { combineReducers } from 'redux';
   import { repositoryReducer, requestReducer } from '@react-redux-fetch/core';

   const rootReducer = combineReducers({
     // ... other reducers
     repository: repositoryReducer,
     requests: requestReducer,
   });

   export default rootReducer;
   ```

3. Configure a data endpoint

   ```js
   const getRandomNameRequest = () => ({
     method: 'GET',
     url: '/api/random-name',
     repository: {
       randomName: (prev, next) => next.name,
     },
   });
   ```

4. Fetch data

   ```jsx
   import { useFetch } from '@react-redux-fetch/hooks';
   import { useSelector } from 'react-redux';

   function App() {
     const [randomNameFetch, fetchRandomName] = useFetch(getRandomNameRequest, {
       eager: true,
     });

     const randomName = useSelector(state => state.repository.randomName);

     return (
       <div className="App">
         {!randomNameFetch || (randomNameFetch.pending && <p>Loading...</p>)}
         {randomNameFetch && randomNameFetch.rejected && <p>Oops something went wrong</p>}
         {randomNameFetch && randomNameFetch.fulfilled && (
           <>
             <p>
               Your random name is <strong>{randomName}</strong>
             </p>
             <button onClick={fetchRandomName}>Generate new name</button>
           </>
         )}
       </div>
     );
   }
   ```
