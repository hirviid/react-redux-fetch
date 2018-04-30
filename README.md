React Redux Fetch
=================

A declarative and customizable way to fetch data for React components and manage that data in the Redux state.

[![build status](https://img.shields.io/travis/hirviid/react-redux-fetch/master.svg?style=flat-square)](https://travis-ci.org/hirviid/react-redux-fetch) [![npm version](https://img.shields.io/npm/v/react-redux-fetch.svg?style=flat-square)](https://www.npmjs.com/package/react-redux-fetch)

## Table of contents
* [Goal](#goal)
* [Motivation](#motivation)
* [Installation](#installation)
* [Setup](#setup)
* [Basic example](#basic-example)
* [How does it work?](#how-does-it-work)
* [API](#api)
    - [Connect](#connect)
    - [Container](#container)
    - [buildActionsFromMappings](#buildactionsfrommappings)
* [Examples](#examples)
    - [POST](#post)
    - [PUT](#put)
    - [DELETE](#delete)
* [Code snippets](./docs/README.md)
* [Versioning](#versioning)

## Goal
The goal of this library is to minimize boilerplate code  of crud operations in react/redux applications.

## Motivation
Redux provides a clean interface for handling data across your application, but integrating with a web service can become a quite cumbersome, repetitive task. [React-refetch by Heroku](https://github.com/heroku/react-refetch) provides a good alternative, but doesn't keep your fetched data in the application state, which makes it more difficult to debug, handle side effects (e.g. with redux-saga) and integrate with your redux actions. This module is strongly inspired by react-refetch; it exposes a `connect()` decorator to keep your components stateless. This function lets you map props to URLs. React-redux-fetch takes these mappings and creates functions which dispatch actions and passes them as props to your component. The response is also passed as a prop to your component with additional pending, fulfilled and rejected flags, just like react-refetch.

## Installation

```
npm install --save react-redux-fetch
```

## Setup

1. Connect the react-redux-fetch middleware to the Store using `applyMiddleware`:
    ```jsx
    // ...
    import {createStore, applyMiddleware} from 'redux'
    import {middleware as fetchMiddleware} from 'react-redux-fetch'

    // ...

    const store = createStore(
        reducer,
        applyMiddleware(fetchMiddleware)
    )

    // rest unchanged
    ```

2. Mount react-redux-fetch reducer to the state at `repository`:
    ```jsx
    import {combineReducers} from 'redux';
    import {reducer as fetchReducer} from 'react-redux-fetch';

    const rootReducer = combineReducers({
        // ... other reducers
        repository: fetchReducer
    });

    export default rootReducer;
    ```

## Basic example
```jsx
import React, {PropTypes} from 'react';
import connect from 'react-redux-fetch';

class PokemonList extends React.Component {
    static propTypes = {
        // injected by react-redux-fetch
        /**
         * @var {Function} dispatchAllPokemonGet call this function to start fetching all Pokémon
         */
        dispatchAllPokemonGet: PropTypes.func.isRequired,
        /**
         * @var {Object} allPokemonFetch contains the result of the request + promise state (pending, fulfilled, rejected)
         */
        allPokemonFetch: PropTypes.object
    };

    componentWillMount() {
        this.props.dispatchAllPokemonGet();
    }

    render() {
        const {allPokemonFetch} = this.props;

        if (allPokemonFetch.rejected) {
            return <div>Oops... Could not fetch Pokémon!</div>
        }

        if (allPokemonFetch.fulfilled) {
            return <ul>
                {allPokemonFetch.value.results.map(pokemon => (
                    <li key={pokemon.name}>{pokemon.name}</li>
                ))}
            </ul>
        }

        return <div>Loading...</div>;
    }
}

// connect(): Declarative way to define the resource needed for this component
export default connect([{
    resource: 'allPokemon',
    method: 'get', // You can omit this, this is the default 
    request: {
        url: 'http://pokeapi.co/api/v2/pokemon/'
    }
}])(PokemonList);
```

## How does it work?
Every entry in the config array passed to `connect()` is mapped to 2 properties, a function to make the actual request and an object containing the response.

The function name consists of 3 parts:
 - dispatch:  to indicate that by calling this function a redux action is dispatched
 - [resourceName]: the name of the resource declared in the config
 - [method]: The method of the request (Get/Delete/Post/Put)

The response object, with name: [resourceName] + 'Fetch', consists of:
 - pending, fulfilled, rejected: Promise flags
 - value: The actual response body
 - meta: The actual response object

When calling `this.props.dispatchAllPokemonGet();`, react-redux-fetch dispatches the action `react-redux-fetch/GET_REQUEST`:

<img src="https://cloud.githubusercontent.com/assets/6641475/17690441/fa6086b2-638e-11e6-9588-15fa41e2fa2b.png" alt="GET_REQUEST/Action" width="500" />

The action creates a new state tree `allPokemon`, inside the `repository` state tree:

<img src="https://cloud.githubusercontent.com/assets/6641475/17690442/fa61e926-638e-11e6-94d4-2a16369ba8ee.png" alt="GET_REQUEST/State" width="500" />

The react-redux-fetch middleware takes this action and builds the request with [Fetch API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API).
This part of the state is passed as a prop to the PokemonList component:

<img src="https://cloud.githubusercontent.com/assets/6641475/17713820/264f9402-63fd-11e6-88a8-9ac2e01b2b5e.png" alt="GET_REQUEST/PENDING" width="300" />

When the request fulfills (i.e. receiving a status code between 200 and 300), react-redux-fetch dispatches the action `react-redux-fetch/GET_FULFIL`:

<img src="https://cloud.githubusercontent.com/assets/6641475/17690440/fa6070be-638e-11e6-9da8-90ee1b975373.png" alt="GET_REQUEST/Action" width="500" />

With updated state tree:

<img src="https://cloud.githubusercontent.com/assets/6641475/17690443/fa645a08-638e-11e6-8b97-8e0a5ff2e657.png" alt="GET_FULFIL/Action" width="500" />

This part of the state is passed as a prop to the PokemonList component:

<img src="https://cloud.githubusercontent.com/assets/6641475/17713773/e0d32628-63fc-11e6-878a-18bbcf64240d.png" alt="PROPS/FULFILLED" width="300" />

## API

### connect()
A higher order component to enhance your component with the react-redux-fetch functionality.

Accepts an array:
```jsx
connect([{
   // ... configuration, see below
}])(yourComponent);
```

Or a function returning an array. This function receives the props and context, which can then be used in your configuration to dynamically build your urls.
```jsx
connect((props, context) => [{
   // ... configuration, see below
}])(yourComponent);
```

The returned array should be an array of objects, with the following properties:
- `resource`: **Object|String, required**. When used as a string, this is the same as `resource: { name: 'myResource' }`.
    * `name`: **String, required**. A name for your resource, this name will be used as a key in the state tree. If no `action` is defined in `resource`, the `name` is used in the dispatch prop, e.g.: `name: 'myResource'` => `dispatchMyResourceGet`.
    * `action`: **String, optional**. A name to use in the dispatch function that's created and passed as a prop. (e.g. `action: 'myAction'` => `dispatchMyActionGet`).
- `method`: **String, optional**, default: 'get'. The request method that will be used for the request. One of 'get', 'post', 'put', 'delete'. Can be extended by adding new types to the registry (see below).
- `request`: **Object|Function, required**. Use a function if you want to pass dynamic data to the request config (e.g. body data).
    * `url`: **String, required**.  The URL to make the request to.
    * `body`: **Object, optional**. The object that will be sent as JSON in the body of the request.
    * `headers`: **Object|Function<header>, optional**. Use this to set the headers, for this request only. Use `container.registerRequestHeader()` to set headers for every request.
    * `meta`: **Object, optional**. Everything passed to 'meta' will be passed to every part in the react-redux-fetch flow.
    * `comparison`: **Any, optional**. If provided, a new request is not made if the `comparison` value between dispatch calls is the same.
    * `force`: **boolean, optional**. If `true`, overrules the `comparison` property.


### container

```js
import { container } from 'react-redux-fetch';
```

The container provides a single entry point into customizing the different parts of react-redux-fetch.
For now, the following customizations are possible, this will be extended in the future:

- **requestMethods**

    Out-of-the-box, react-redux-refetch provides implementations for `get`, `post`, `put` and `delete` requests.
    A new request method, e.g. `patch`, can be added like this:
    ```js
    container.registerRequestMethod('patch', {
      method: 'patch', // The request method
      middleware: fetchRequest, // The middleware to handle the actual fetching. 'fetchRequest' from 'react-redux-fetch' is a sensible default for any request method.
      reducer: patchReducer
    });
    ```

    An existing request method definition can be altered like this:
    ```js
    // Replace middleware for POST requests with a mock
    container.changeRequestMethodConfig('post', 'middleware', mockFetchMiddleware);
    ```

- **requestHeaders**

    The default request headers are `'Accept': 'application/json'` and `'Content-Type': 'application/json'`. You can add request headers:
    ```js
    container.registerRequestHeader('authorization', 'Bearer some.jwt.token');
    ```
    Or replace the request headers:
    ```js
    container.replaceRequestHeaders({ 'Content-Type', 'application/xml' });
    ```

- **reducers**

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


- **requestBuilder**

    The requestBuilder is used by the default react-redux-fetch middleware. Takes a URL and request config and returns a Request object.
    To replace the default implementation:
    ```js
    container.getDefinition('requestBuilder').replaceArgument('build', customRequestBuilder);
    ```

### buildActionsFromMappings

```js
import { buildActionsFromMappings } from 'react-redux-fetch';
```

The function internally used by `connect()`. You can use this function to create the fetch redux actions without a React Component.
`buildActionsFromMappings(config)` accepts the same configuration options as `connect()`.

```js
const actions = buildActionsFromMappings([{
  resource: 'todos',
  request: {
    url: apiRoutes.getTodos(),
  },
}]);

store.dispatch(actions.todosGet());
```

## Examples

### POST
```jsx
import React, {PropTypes} from 'react';
import connect from 'react-redux-fetch';

class Playground extends React.Component {
    static propTypes = {
        // injected by parent
        pokemonOnField: PropTypes.object.isRequired,
        // injected by react-redux-fetch
        dispatchPokemonPost: PropTypes.func.isRequired,
        pokemonFetch: PropTypes.object
    };

    handleCatchPokemon = () => {
        const {pokemonOnField, dispatchPokemonPost} = this.props;
        dispatchPokemonPost(pokemonOnField.id, pokemonOnField.name, pokemonOnField.sprites.front_default);
    };

    render() {
        const {pokemonOnField, pokemonFetch} = this.props;

        return (
            <div>
                <h3>{pokemonOnField.name}</h3>
                <img alt={pokemonOnField.name} src={pokemonOnField.sprites.front_default}/>
                {!pokemonFetch &&
                <button onClick={this.handleCatchPokemon}>catch!</button>
                }
            </div>
        );
    }
}


export default connect([{
    resource: 'pokemon',
    method: 'post',
    request: (id, name, image) => ({
        url: '/api/pokemon/catch',
        body: {
            id,
            name,
            image
        })
}])(Playground);
```

### PUT
Analogous to POST

### DELETE
```jsx
import React, {PropTypes} from 'react';
import connect from 'react-redux-fetch';

class Pokemon extends React.Component {
    static propTypes = {
        // injected by parent
        myPokemon: PropTypes.object.isRequired,
        // injected by react-redux-fetch
        dispatchPokemonDelete: PropTypes.func.isRequired
    };

    handleReleasePokemon = () => {
        this.props.dispatchPokemonDelete(this.props.myPokemon.id);
    };

    render() {
        const {myPokemon, dispatchPokemonDelete} = this.props;

        return (
            <div>
                <h3>{myPokemon.name}</h3>
                <img alt={myPokemon.name} src={myPokemon.image}/>
                <button onClick={this.handleReleasePokemon}>catch!</button>
            </div>
        );
    }
}


export default connect([{
    resource: 'pokemon',
    method: 'delete',
    request: (id) => ({
        url: `/api/pokemon/${id}/release`,
        meta: {
            removeFromList: {
                idName: 'id',
                id: id
            }
        }
}])(Pokemon);
```
A special property `removeFromList` can be specified in `meta`, which removes an element from the state if the resource value is a list.
(In the example, the `pokemon` state contains a collection of Pokémon.)
- `idName`: The id-key of the object to find and delete
- `id`: The id-value of the object to find and delete

## Code snippets

[Code snippets](./docs/README.md)

## Versioning

[Semver](http://semver.org/) is followed as closely as possible. For updates and migration instructions, see the [changelog](https://github.com/hirviid/react-redux-fetch/wiki/Changelog).
