---
id: how-does-it-work
title: How does it work?
---

This page briefly talks about how the configuration you pass is mapped to 2 properties, a function to trigger the fetch, and an object containing the response. You can find the example also on [codesandbox](https://codesandbox.io/s/zrzyk78wp).

## FetchConfig

You write data source declarations in a **fetchConfig** array.

This is the minimal configuration to make 1 call:

```js
const fetchConfig = [
  {
    resource: 'photos',
    request: {
      url: '//jsonplaceholder.typicode.com/albums/1/photos',
    },
  },
];
```

You can read more about all the options in the [fetchConfig API docs](/react-redux-fetch/docs/redux-fetch-config).

This **fetchConfig** array is passed to the `reduxFetch` HoC, or the `<ReduxFetch />` component as follows:

1. [HoC](/react-redux-fetch/docs/hoc): `reduxFetch(fetchConfig)(MyComponent)`
2. [Render prop](/react-redux-fetch/docs/render-prop): `<ReduxFetch config={fetchConfig}>{() => { /* ... */ }}</ReduxFetch>`

React Redux Fetch takes this configuration, and provides 2 things back as _props_:

#### 1. A function to make the actual request.

- From the example above, that would be **dispatchPhotosGet**. This function name consists of 3 parts:

  - dispatch: to indicate that by calling this function a redux action is dispatched
  - [resourceName]: the name of the resource declared in the config
  - [method]: The method of the request (Get/Delete/Post/Put)

#### 2. An object containing the promise state with response

- From the example above, that would be **photosFetch**. This object has the following properties:

  - pending, fulfilled, rejected: Promise flags
  - value: The actual response body
  - meta: The actual response object

## Actions dispatched

### Request

When calling `this.props.dispatchPhotosGet();`, react-redux-fetch dispatches the action `react-redux-fetch/GET_REQUEST`:

<img src="/react-redux-fetch/img/how-it-works/request-action.png" alt="react-redux-fetch/GET_REQUEST"  />

The action creates a new state tree "photos", inside the repository state tree:

<img src="/react-redux-fetch/img/how-it-works/request-state.png" alt="react-redux-fetch/GET_REQUEST"  />

The react-redux-fetch middleware takes this action and builds the request with [Fetch API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API). This part of the state is passed as a prop to the AlbumPhotos component:

<img src="/react-redux-fetch/img/how-it-works/request-props.png" alt="react-redux-fetch/GET_REQUEST"  />

### Fulfil

When the request fulfills (i.e. receiving a status code between 200 and 300), react-redux-fetch dispatches the action `react-redux-fetch/GET_FULFIL`:

<img src="/react-redux-fetch/img/how-it-works/fulfil-action.png" alt="react-redux-fetch/GET_REQUEST"  />

With updated state tree:

<img src="/react-redux-fetch/img/how-it-works/fulfil-state.png" alt="react-redux-fetch/GET_REQUEST"  />

This part of the state is passed as a prop to the AlbumPhotos component:

<img src="/react-redux-fetch/img/how-it-works/fulfil-props.png" alt="react-redux-fetch/GET_REQUEST"  />

### Reject

Similarly, when the request fails, react-redux-fetch dispatches the action `react-redux-fetch/GET_REJECT`:

<img src="/react-redux-fetch/img/how-it-works/reject-props.png" alt="react-redux-fetch/GET_REQUEST"  />
