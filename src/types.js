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
      addToList?: {
        path?: string,
        idName: string,
      },
    },
  },
}
