---
id: redux-fetch-config
title: fetchConfig
---

To use `reduxFetch()` (hoc), or `<ReduxFetch />` (render prop), you need to define a special object `fetchConfig` to describe the API call you want to make.

**Because you can describe multiple API resources per react-redux-fetch instance, this object should be provided in an array** (or [function in case of the HoC](<(/react-redux-fetch/docs/hoc)>)) to react-redux-fetch:

The fetchConfig object has the following required and optional properties:

## Properties

- `resource`: **Object|String [required]**

  When used as a string, this is the same as `resource: { name: 'myResource' }`.

  - `name`: **String [required]**. A name for your resource, this name will be used as a key in the state tree. If no `action` is defined in `resource`, the `name` is used in the dispatch prop, e.g.: `name: 'myResource'` => `dispatchMyResourceGet`.
  - `action`: **String [optional]**. A name to use in the dispatch function that's created and passed as a prop. (e.g. `action: 'myAction'` => `dispatchMyActionGet`)

- `method`: **String [optional]**, default: 'get'.

  The request method that will be used for the request. One of 'get', 'post', 'put', 'delete'. Can be extended by adding new types to the registry.

- `request`: **Object|Function [required]**.

  Use a function if you want to pass dynamic data to the request config (e.g. body data).

  - `url`: **String [required]**. The URL to make the request to.
  - `body`: **Object [optional]**. The object that will be sent as JSON in the body of the request.
  - `headers`: **Object|Function<header> [optional]**. Use this to set the headers, for this request only. Use `container.registerRequestHeader()` to set headers for every request. When used as a function, the function receives the default headers as the first parameter.
  - `meta`: **Object [optional]**. Everything passed to 'meta' will be passed to every part in the react-redux-fetch flow.
  - `comparison`: **String [optional]**. If provided, a new request is not made if the `comparison` value between dispatch calls is the same.
  - `force`: **boolean [optional]**. When `true`, overrules the `comparison` property.
  - `clearValueOnRequest`: **boolean [optional]**. From v0.15.0: When `true`, the value is not kept between two requests with the same resource.

## Example

```js
const fetchConfigs = [
  {
    resource: 'allPokemon',
    method: 'get', // You can omit this, this is the default
    request: {
      url: 'http://pokeapi.co/api/v2/pokemon/',
    },
  },
];

// Render prop
<ReduxFetch config={fetchConfigs}>() => /* */</reduxFetch>

// HoC
reduxFetch(fetchConfigs)(MyComponent)

```
