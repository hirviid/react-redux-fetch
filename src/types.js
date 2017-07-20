// @flow

export type reduxAction = {
  type: string,
};

export type PromiseState = {
  pending: boolean,
  fulfilled: boolean,
  rejected: boolean,
  value: *,
  request: {
    meta: *,
  },
};

export type FulfillAction = {
  type: string,
  key: string,
  value: *,
  request: {
    meta?: {
      removeFromList?: {
        path?: string,
        idName: string,
        id?: number | string | Array<number | string>,
      },
      addToList?: {
        path?: string,
        idName: string,
      },
    },
  },
};
