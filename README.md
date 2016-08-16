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
