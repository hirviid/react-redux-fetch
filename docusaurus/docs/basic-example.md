---
id: basic-example
title: Basic Example
---

React Redux Fetch can be used as a higher order component, or with render props.

## Render props

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

[Try it out a render prop example in codesandbox](https://codesandbox.io/s/553olm44p)

## Higher order component

```js
import React from 'react';
import PropTypes from 'prop-types';
import reduxFetch from 'react-redux-fetch';

class PokemonList extends React.Component {
  static propTypes = {
    dispatchAllPokemonGet: PropTypes.func.isRequired,
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

[Try it out a HoC example in codesandbox](https://codesandbox.io/s/zrzyk78wp)
