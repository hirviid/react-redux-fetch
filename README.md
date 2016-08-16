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
```jsx
// TODO
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

![GET_REQUEST/Action](https://cloud.githubusercontent.com/assets/6641475/17690441/fa6086b2-638e-11e6-9588-15fa41e2fa2b.png)

The action creates a new state tree `allPokemon`, inside the `fetch` state tree:

![GET_REQUEST/State](https://cloud.githubusercontent.com/assets/6641475/17690442/fa61e926-638e-11e6-94d4-2a16369ba8ee.png)

When the request fulfils (i.e. status code between 200 and 300), react-redux-fetch dispatches the action `react-redux-fetch/GET_FULFIL`:

![GET_FULFIL/Action](https://cloud.githubusercontent.com/assets/6641475/17690440/fa6070be-638e-11e6-9da8-90ee1b975373.png)

With updated state tree:

![GET_FULFIL/Action](https://cloud.githubusercontent.com/assets/6641475/17690443/fa645a08-638e-11e6-8b97-8e0a5ff2e657.png)


## API

### connect()
TODO

### registry
TODO
