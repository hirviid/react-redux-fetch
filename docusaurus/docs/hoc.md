---
id: hoc
title: reduxFetch()
sidebar_label: reduxFetch()
---

The `reduxFetch()` function is one of the two ways to connect react-redux-fetch to your component. [You can read more about the other way (ReduxFetch component) here](/react-redux-fetch/docs/render-prop).

The technique used for `reduxFetch()` is a commonly used technique for code sharing in React, called "[Higher order Component](https://reactjs.org/docs/higher-order-components.html)".

## Importing

```js
var reduxFetch = require('react-redux-fetch'); // ES5

import reduxFetch from 'react-redux-fetch'; // ES6
```

## Arguments you can pass to reduxFetch

```js
reduxFetch(fetchConfig, mapStateToProps?, mapDispatchToProps?)(YourComponent);
```

- `fetchConfig`: **Array<ReactReduxFetchResource>|(props, context) => Array<ReactReduxFetchResource> [required]**

  Read more in the [FetchConfig documentation](/react-redux-fetch/docs/redux-fetch-config) for all possible config properties.
  When used as a function, the function receives the props and the context, which can then be used in your configuration to dynamically build your urls.
  Note: Using just the Array is preferred, because this allows react-redux-fetch to cache the generated dispatch functions.

* `mapStateToProps`: [See react-redux documentation](https://react-redux.js.org/api/connect)
* `mapDispatchToProps`: [See react-redux documentation](https://react-redux.js.org/api/connect)

## Usage

```js
import React from 'react';
import reduxFetch from 'react-redux-fetch';

class PokemonList extends React.Component {
  // ...
}

// reduxFetch(): Declarative way to define the resource needed for this component
export default reduxFetch([
  {
    resource: 'allPokemon',
    method: 'get', // You can omit this, this is the default
    request: {
      url: 'http://pokeapi.co/api/v2/pokemon/',
    },
  },
])(PokemonList);
```
