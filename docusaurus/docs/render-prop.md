---
id: render-prop
title: ReduxFetch
sidebar_label: <ReduxFetch />
---

The `ReduxFetch` component is one of the two ways to connect react-redux-fetch to your component. [You can read more about the other way (reduxFetch HoC) here](/react-redux-fetch/docs/hoc).

The technique used for `ReduxFetch` is a commonly used technique for code sharing in React, called "[Render Props](https://reactjs.org/docs/render-props.html)".

## Importing

```js
var ReduxFetch = require('react-redux-fetch').ReduxFetch; // ES5

import { ReduxFetch } from 'react-redux-fetch'; // ES6
```

## Props you can pass to ReduxFetch

- `config`: **Array<ReactReduxFetchResource> [required]**

  Read more in the [FetchConfig documentation](/react-redux-fetch/docs/redux-fetch-config) for all possible config properties.

- `fetchOnMount`: **Boolean|Array<ResourceName> [optional]**

  Automatically call an API endpoint when the component is rendered. When a boolean is given, all endpoints from the `config` prop are called. When an array is given, only the resource names which are given to the `fetchOnMount` prop are called.

- `onFulfil`: **(ResourceName, PromiseState<\*>, DispatchFunctions) => void [optional]**

  Called every time one of the configured resources transitions from the pending to the fulfilled state.

- `onReject`: **(ResourceName, PromiseState<\*>, DispatchFunctions) => void [optional]**

  Called every time one of the configured resources transitions from the pending to the rejected state.

- `children`: **Object => React.Node [required]**

  A function which receives an object of promise states and dispatch functions.
  You can read more about the [generated promise states and dispatch functions here](/react-redux-fetch/docs/how-does-it-work#1-a-function-to-make-the-actual-request). The function should return a React node, which will be rendered.

## Usage

<iframe src="https://codesandbox.io/embed/553olm44p?initialpath=%2Fsrc%2Fcomponents%2FAlbumPhotos.js" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
