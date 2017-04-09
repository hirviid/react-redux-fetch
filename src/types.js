// @flow

export type PromiseState = {
  pending: boolean,
  fulfilled: boolean,
  rejected: boolean,
  value: *,
  request: {
    meta: *,
  }
}

export type FulfillAction = {
  type: string,
  key: string,
  value: *,
  request: {
    meta?: {
      removeFromList?: {
        path?: string,
        idName: string,
      },
      addToList?: {
        path?: string,
        idName: string,
      },
    },
  },
}
