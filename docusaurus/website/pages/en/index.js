/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

// // const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(`${process.cwd()}/siteConfig.js`);

function imgUrl(img) {
  return `${siteConfig.baseUrl}img/${img}`;
}

function docUrl(doc, language) {
  return `${siteConfig.baseUrl}docs/${language ? `${language}/` : ''}${doc}`;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? `${language}/` : '') + page;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} alt="Project Logo" />
  </div>
);

const ProjectTitle = () => (
  <h2 className="projectTitle">
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    const language = this.props.language || '';
    return (
      <SplashContainer>
        <Logo img_src={imgUrl('react-redux-fetch.svg')} />
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href={docUrl('getting-started', language)}>Get started</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Block = props => (
  <Container padding={['bottom', 'top']} id={props.id} background={props.background}>
    <GridBlock align={props.align} contents={props.children} layout={props.layout} />
  </Container>
);
Block.defaultProps = {
  align: 'center',
};

const Features = () => (
  <Block layout="fourColumn">
    {[
      {
        content:
          'No more creating actions, action types, reducers, middleware and selectors for every API call. React-redux-fetch removes this boilerplate without losing flexibility.',
        image: imgUrl('react-redux-fetch-blue.svg'),
        imageAlign: 'top',
        title: 'Remove boilerplate',
      },
      {
        content:
          'Almost every part of react-redux-fetch can be replaced with a custom implementation. Use the sensible defaults, or customize where needed.',
        image: imgUrl('feature-customize.svg'),
        imageAlign: 'top',
        title: 'Highly customizable',
      },
    ]}
  </Block>
);

const GetStarted = props => (
  <Block layout="twoColumn" background="light" {...props}>
    {[
      {
        content: `To download react-redux-fetch, run:
        
\`\`\`sh
npm install --save react-redux-fetch
\`\`\`
or
\`\`\`sh
yarn add react-redux-fetch
\`\`\`        
        `,
        title: 'Installation',
      },
      {
        content: `
1. Connect the react-redux-fetch middleware to the Store using applyMiddleware:

\`\`\`js
  // configureStore.js

  import { middleware as fetchMiddleware } from 'react-redux-fetch';       
  import { applyMiddleware, createStore } from 'redux';
  
  const configureStore = (initialState, rootReducer) => {
    const middleware = [fetchMiddleware, otherMiddleware];
  
    const store = createStore(
      rootReducer,
      initialState,
      applyMiddleware(...middleware)
    );
  
    return store;
  };

  export default configureStore;
\`\`\`      

2. Mount react-redux-fetch reducer to the state at repository:
\`\`\`js
  // rootReducer.js

  import { combineReducers } from 'redux';
  import { reducer as fetchReducer } from 'react-redux-fetch';

  const rootReducer = combineReducers({
    // ... other reducers
    repository: fetchReducer
  });

  export default rootReducer;
\`\`\`
        `,
        title: 'Setup',
      },
    ]}
  </Block>
);

const Usage = props => (
  <Block layout="twoColumn" {...props}>
    {[
      {
        content: `
\`\`\`js

import React from 'react';
import PropTypes from 'prop-types'
import reduxFetch from 'react-redux-fetch';

class PokemonList extends React.Component {
    static propTypes = {
        dispatchAllPokemonGet: PropTypes.func.isRequired,
        allPokemonFetch: PropTypes.object
    };

    componentDidMount() {
        this.props.dispatchAllPokemonGet();
    }

    render() {
        const {allPokemonFetch} = this.props;

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
export default reduxFetch([{
    resource: 'allPokemon',
    method: 'get', // You can omit this, this is the default 
    request: {
        url: 'http://pokeapi.co/api/v2/pokemon/'
    }
}])(PokemonList);   
\`\`\`     
`,
        title: 'Usage: Higher order Component',
      },
      {
        content: `
\`\`\`js

import React from 'react';
import { ReduxFetch } from 'react-redux-fetch';

const fetchConfig = [{
  resource: 'allPokemon',
  method: 'get', // You can omit this, this is the default 
  request: {
      url: 'http://pokeapi.co/api/v2/pokemon/'
  }
}];

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
\`\`\`     
        `,
        title: 'Usage: Render props',
      },
    ]}
  </Block>
);

class Index extends React.Component {
  render() {
    const language = this.props.language || '';

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <Features />
          <GetStarted align="left" />
          <Usage align="left" />
        </div>
      </div>
    );
  }
}

module.exports = Index;
