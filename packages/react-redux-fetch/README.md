# React Redux Fetch

A declarative and customizable way to fetch data for React components and manage that data in the Redux state.

[![build status](https://img.shields.io/travis/hirviid/react-redux-fetch/master.svg?style=flat-square)](https://travis-ci.org/hirviid/react-redux-fetch) [![npm version](https://img.shields.io/npm/v/react-redux-fetch.svg?style=flat-square)](https://www.npmjs.com/package/react-redux-fetch)

## Documentation

- [Getting started](http://hirviid.github.io/react-redux-fetch/docs/getting-started)
- [API](http://hirviid.github.io/react-redux-fetch/docs/redux-fetch-config)
- [Examples](http://hirviid.github.io/react-redux-fetch/docs/examples)

## Goal

The goal of this library is to minimize boilerplate code of crud operations in react/redux applications.

## Motivation

Redux provides a clean interface for handling data across your application, but integrating with a web service can become a quite cumbersome, repetitive task. [React-refetch by Heroku](https://github.com/heroku/react-refetch) provides a good alternative, but doesn't keep your fetched data in the application state, which makes it more difficult to debug, handle side effects (e.g. with redux-saga) and integrate with your redux actions. This module is strongly inspired by react-refetch; it exposes a `connect()` decorator to keep your components stateless. This function lets you map props to URLs. React-redux-fetch takes these mappings and creates functions which dispatch actions and passes them as props to your component. The response is also passed as a prop to your component with additional pending, fulfilled and rejected flags, just like react-refetch.

## Installation

```
npm install --save react-redux-fetch

yarn add react-redux-fetch
```

## Setup

1. Connect the react-redux-fetch middleware to the Store using `applyMiddleware`:

   ```jsx
   // ...
   import { createStore, applyMiddleware } from 'redux';
   import { middleware as fetchMiddleware } from 'react-redux-fetch';

   // ...

   const store = createStore(reducer, applyMiddleware(fetchMiddleware));

   // rest unchanged
   ```

2. Mount react-redux-fetch reducer to the state at `repository`:

   ```jsx
   import { combineReducers } from 'redux';
   import { reducer as fetchReducer } from 'react-redux-fetch';

   const rootReducer = combineReducers({
     // ... other reducers
     repository: fetchReducer,
   });

   export default rootReducer;
   ```

## Examples

react-redux-fetch exposes two ways to connect your component to your api configuration:

1. [Render prop](https://hirviid.github.io/react-redux-fetch/docs/render-prop)
2. [Higher order Component](https://hirviid.github.io/hoc)

### GET

#### Render props

```js
import React from 'react';
import { ReduxFetch } from 'react-redux-fetch';

const fetchConfig = [
  {
    resource: 'allPokemon',
    method: 'get', // You can omit this, this is the default
    request: {
      url: 'http://pokeapi.co/api/v2/pokemon/',
    },
  },
];

const PokemonList = () => (
  <ReduxFetch config={fetchConfig} fetchOnMount>
    {({ allPokemonFetch }) => {
      if (allPokemonFetch.rejected) {
        return <div>Oops... Could not fetch Pokémon!</div>;
      }

      if (allPokemonFetch.fulfilled) {
        return (
          <ul>
            {allPokemonFetch.value.results.map(pokemon => (
              <li key={pokemon.name}>{pokemon.name}</li>
            ))}
          </ul>
        );
      }

      return <div>Loading...</div>;
    }}
  </ReduxFetch>
);

export default PokemonList;
```

#### Higher order component

```jsx
import React, { PropTypes } from 'react';
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
    allPokemonFetch: PropTypes.object,
  };

  componentDidMount() {
    this.props.dispatchAllPokemonGet();
  }

  render() {
    const { allPokemonFetch } = this.props;

    if (allPokemonFetch.rejected) {
      return <div>Oops... Could not fetch Pokémon!</div>;
    }

    if (allPokemonFetch.fulfilled) {
      return (
        <ul>
          {allPokemonFetch.value.results.map(pokemon => (
            <li key={pokemon.name}>{pokemon.name}</li>
          ))}
        </ul>
      );
    }

    return <div>Loading...</div>;
  }
}

// connect(): Declarative way to define the resource needed for this component
export default connect([
  {
    resource: 'allPokemon',
    method: 'get', // You can omit this, this is the default
    request: {
      url: 'http://pokeapi.co/api/v2/pokemon/',
    },
  },
])(PokemonList);
```

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
