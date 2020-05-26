import * as React from 'react';
import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { render, waitForElement, getByTestId, fireEvent } from '@testing-library/react';
import {
  FetchConfig,
  fetchMiddleware,
  ReactReduxFetchState,
  repositoryReducer,
  RequestHandler,
  requestReducer,
} from '@react-redux-fetch/core';
import { Provider, useSelector } from 'react-redux';
import { useFetch } from '../useFetch';

type State = ReactReduxFetchState & {
  repository: {
    message: string;
  },
};

const rootReducer = combineReducers({
  repository: repositoryReducer,
  requests: requestReducer,
});

let store: Store;

const App: React.FC = props => {
  return <Provider store={store}>{props.children}</Provider>;
};

const mockNetworkInterface: RequestHandler = () => {
  return {
    abort() {},
    handle(cb) {
      setTimeout(() => cb(200, { message: 'Hello World' }), 100);
    },
  };
};

describe('useFetch', () => {
  beforeEach(() => {
    store = createStore(
      rootReducer,
      applyMiddleware(fetchMiddleware({ requestHandler: mockNetworkInterface }))
    );
  });

  const fetchConfig = (): FetchConfig<State['repository']> => ({
    url: '/message',
    repository: {
      message: (_prev, next) => next.message,
    },
  });

  it('Should load data eagerly', async () => {
    const Content = () => {
      const [promiseState] = useFetch(fetchConfig, { eager: true });
      const message = useSelector((state: State) => state.repository.message);

      if (promiseState?.pending) {
        return <div data-testid="promise-state-pending">PENDING</div>;
      }

      return (
        <>
          <div data-testid="promise-state-fulfilled">FULFILLED</div>
          <div data-testid="value">{message}</div>
        </>
      );
    };

    const { container } = render(
      <App>
        <Content />
      </App>
    );

    {
      const contentNode = await waitForElement(() =>
        getByTestId(container, 'promise-state-pending')
      );
      expect(contentNode.textContent).toBe('PENDING');
    }

    {
      const contentNode = await waitForElement(() =>
        getByTestId(container, 'promise-state-fulfilled')
      );
      expect(contentNode.textContent).toBe('FULFILLED');
    }

    {
      const contentNode = await waitForElement(() =>
          getByTestId(container, 'value')
      );
      expect(contentNode.textContent).toBe('Hello World');
    }
  });

  it('Should load data after user interaction', async () => {
    const Content = () => {
      const [promiseState, onRequest] = useFetch(fetchConfig);
      const message = useSelector((state: State) => state.repository.message);

      if (!promiseState) {
        return (
          <>
            <div data-testid="promise-state-empty">EMPTY</div>
            <button data-testid="do-request" onClick={onRequest}>
              Do request
            </button>
          </>
        );
      }

      if (promiseState.pending) {
        return <div data-testid="promise-state-pending">PENDING</div>;
      }

      if (promiseState.fulfilled) {
        return (
            <>
              <div data-testid="promise-state-fulfilled">FULFILLED</div>
              <div data-testid="value">{message}</div>
            </>
        );
      }

      return <div>Oops</div>;
    };

    const { container } = render(
        <App>
          <Content />
        </App>
    );

    {
      const contentNode = getByTestId(container, 'promise-state-empty');
      expect(contentNode.textContent).toBe('EMPTY');
    }

    {
      const buttonNode = getByTestId(container, 'do-request');
      fireEvent.click(buttonNode);
    }

    {
      const contentNode = await waitForElement(() =>
          getByTestId(container, 'promise-state-pending')
      );
      expect(contentNode.textContent).toBe('PENDING');
    }

    {
      const contentNode = await waitForElement(() =>
          getByTestId(container, 'promise-state-fulfilled')
      );
      expect(contentNode.textContent).toBe('FULFILLED');
    }

    {
      const contentNode = await waitForElement(() =>
          getByTestId(container, 'value')
      );
      expect(contentNode.textContent).toBe('Hello World');
    }
  });

  it('Should have the correct promiseState in another component (using the requestKey option)', async () => {
    const fetchConfigWithRequestKey = (): FetchConfig<State['repository']> => ({
      url: '/message',
      requestKey: 'veryAwesomeRequestKey',
      repository: {
        message: (_prev, next) => next.message,
      },
    });

    const Content = () => {
      useFetch(fetchConfigWithRequestKey, {eager: true});

      return null;
    }

    const Content2 = () => {
      const [promiseState] = useFetch(fetchConfigWithRequestKey);

      if (promiseState?.pending) {
        return <div data-testid="promise-state-pending">PENDING</div>;
      }

      if (promiseState?.fulfilled) {
        return <div data-testid="promise-state-fulfilled">FULFILLED</div>;
      }

      return null;
    }

    const { container } = render(
        <App>
          <Content />
          <Content2 />
        </App>
    );

    {
      const contentNode = await waitForElement(() =>
          getByTestId(container, 'promise-state-pending')
      );
      expect(contentNode.textContent).toBe('PENDING');
    }
    {
      const contentNode = await waitForElement(() =>
          getByTestId(container, 'promise-state-fulfilled')
      );
      expect(contentNode.textContent).toBe('FULFILLED');
    }
  })
});
