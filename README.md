**THIS IS A WORK IN PROGRESS**

React Redux Fetch
=================

A declarative and customizable way to fetch data for React components and manage that data in the Redux state.


[![build status](https://img.shields.io/travis/hirviid/react-redux-fetch/master.svg?style=flat-square)](https://travis-ci.org/hirviid/react-redux-fetch) [![npm version](https://img.shields.io/npm/v/react-redux-fetch.svg?style=flat-square)](https://www.npmjs.com/package/react-redux-fetch)


## Installation

```
npm install --save react-redux-fetch
```

## Goal
The goal of this library is to minimize boilerplate code  of crud operations in react/redux applications.

## Motivation
Redux provides a clean interface for handling data across your application, but integrating with a web service can become a quite cumbersome, repetitive task. [React-refetch by Heroku](https://github.com/heroku/react-refetch) provides a good alternative, but doesn't keep your fetched data in the application state, which makes it more difficult to debug, handle side effects (e.g. with redux-saga) and integrate with your redux actions. This module is strongly inspired by react-refetch; it exposes a `connect()` decorator to keep your components stateless. This function lets you map props to URLs. React-redux-fetch takes these mappings and creates functions which dispatch actions and passes them as props to your component. The response is also passed as a prop to your component with additional pending, fulfilled and rejected flags, just like react-refetch.

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

2. Mount react-redux-fetch reducer to the state at `fetch`: 
    ```jsx
    import {combineReducers} from 'redux';
    import {reducer as fetchReducer} from 'react-redux-fetch';
    
    const rootReducer = combineReducers({
        // ... other reducers
        fetch: fetchReducer
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
         * @var {Function} dispatchAllPokemonFetch call this function to start fetching all Pokémon
         */
        dispatchAllPokemonFetch: PropTypes.func.isRequired,
        /**
         * @var {Object} allPokemon contains the result of the request + promise state (pending, fulfilled, rejected)
         */
        allPokemon: PropTypes.object
    };

    componentWillMount() {
        this.props.dispatchAllPokemonFetch();
    }

    render() {
        const {allPokemon} = this.props;

        if (allPokemon.rejected) {
            return <div>Oops... Could not fetch Pokémon!</div>
        }

        if (allPokemon.fulfilled) {
            return <ul>
                {allPokemon.value.results.map(pokemon => (
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
    request: {
        url: 'http://pokeapi.co/api/v2/pokemon/'
    }
}])(PokemonList);
```

## How does it work?
Every entry in the config array passed to `connect()` is mapped to 2 properties, a function to make the actually request and an object containing the response. 

The function name consists of 3 parts:
 - dispatch:  to indicate that by calling this function a redux action is dispatched
 - [resourceName]: the name of the resource declared in the config
 - Fetch|Remove|Create|Update: a verb to indicate the method of the request (get/delete/post/put)

The response object consists of:
 - pending, fulfilled, rejected: Promise flags
 - value: The actual response body
 - meta: The actual response object

When calling `this.props.dispatchAllPokemonFetch();`, react-redux-fetch dispatches the action `react-redux-fetch/GET_REQUEST`: 

![GET_REQUEST/Action](https://cloud.githubusercontent.com/assets/6641475/17690441/fa6086b2-638e-11e6-9588-15fa41e2fa2b.png =500x)

The action creates a new state tree `allPokemon`, inside the `fetch` state tree:

![GET_REQUEST/State](https://cloud.githubusercontent.com/assets/6641475/17690442/fa61e926-638e-11e6-94d4-2a16369ba8ee.png =300x)

The react-redux-fetch middleware takes this action and builds the request with [Fetch API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API).
This part of the state is passed as a prop to the PokemonList component:

![PROPS/PENDING](https://cloud.githubusercontent.com/assets/6641475/17713820/264f9402-63fd-11e6-88a8-9ac2e01b2b5e.png =300x)

When the request fulfils (i.e. receiving a status code between 200 and 300), react-redux-fetch dispatches the action `react-redux-fetch/GET_FULFIL`:

![GET_FULFIL/Action](https://cloud.githubusercontent.com/assets/6641475/17690440/fa6070be-638e-11e6-9da8-90ee1b975373.png =300x)

With updated state tree:

![GET_FULFIL/Action](https://cloud.githubusercontent.com/assets/6641475/17690443/fa645a08-638e-11e6-8b97-8e0a5ff2e657.png =300x)

This part of the state is passed as a prop to the PokemonList component:

![PROPS/FULFILLED](https://cloud.githubusercontent.com/assets/6641475/17713773/e0d32628-63fc-11e6-878a-18bbcf64240d.png =300x)

## API

### connect()
A higher order component to enhance your component with the react-redux-fetch functionality.

Accepts an array: 
```jsx
connect([{
   // ... configuration, see below
}])(yourComponent);
```

Or a function returning an array. This function receives the props, which can then be used in your configuration to dynamically build your urls. 
```jsx
connect((props) => [{
   // ... configuration, see below
}])(yourComponent);
```

The returned array should be an array of objects, with the following properties:
- `resource`: **String, required**. A name for your resource, this name will be used as a key in the state tree.
- `method`: **String, optional**, default: 'get'. The request method that will be used for the request. One of 'get', 'post', 'put', 'delete'. Can be extended by adding new types to the registry (see below).
- `request`: **Object|Function, required**. Use a function if you want to pass dynamic data to the request config (e.g. body data).
    * `url`: **String, required**.  The URL to make the request to.
    * `meta`: **Object, optional**. Everything passed to 'meta' will be passed to every part in the react-redux-fetch flow.


### registry
TODO
