---
id: how-does-it-work
title: How does it work?
---

## FetchConfig

You write data source declarations in a **fetchConfig** array.

This is the minimal configuration to make 1 call:

```js
const fetchConfig = [
  {
    resource: 'allPokemon',
    request: {
      url: 'http://pokeapi.co/api/v2/pokemon/',
    },
  },
];
```

[Read more about all the options in the fetchConfig API docs.](/react-redux-fetch/docs/redux-fetch-config)

This **fetchConfig** array is passed to the `reduxFetch` HoC, or the `<ReduxFetch />` component.

1. [HoC](/react-redux-fetch/docs/hoc): `reduxFetch(fetchConfig)(MyComponent)`
2. [Render prop](/react-redux-fetch/docs/render-prop): `<ReduxFetch config={fetchConfig}>{() => { /* ... */ }}</ReduxFetch>`

React Redux Fetch takes this configuration, and provides 2 things back as _props_:

#### 1. A function to make the actual request.

- From the example above, that would be **dispatchAllPokemonGet**. This function name consists of 3 parts:

  - dispatch: to indicate that by calling this function a redux action is dispatched
  - [resourceName]: the name of the resource declared in the config
  - [method]: The method of the request (Get/Delete/Post/Put)

#### 2. An object containing the promise state with response

- From the example above, that would be **allPokemonFetch**. This object has the following properties:

  - pending, fulfilled, rejected: Promise flags
  - value: The actual response body
  - meta: The actual response object

## Actions dispatched

### Request

When calling `this.props.dispatchAllPokemonGet();`, react-redux-fetch dispatches the action `react-redux-fetch/GET_REQUEST`:

<!-- TODO screenshot -->

The action creates a new state tree allPokemon, inside the repository state tree:

<!-- TODO screenshot -->

The react-redux-fetch middleware takes this action and builds the request with [Fetch API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API). This part of the state is passed as a prop to the PokemonList component:

### Fulfil

When the request fulfills (i.e. receiving a status code between 200 and 300), react-redux-fetch dispatches the action `react-redux-fetch/GET_FULFIL`:

<!-- TODO screenshot -->

With updated state tree:

<!-- TODO screenshot -->

This part of the state is passed as a prop to the PokemonList component:

<!-- TODO screenshot -->

### Reject

TODO
