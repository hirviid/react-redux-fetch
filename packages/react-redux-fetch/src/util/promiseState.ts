import {PromiseState} from "../types";

export const allFulfilled = (promiseStates: PromiseState[]) => {
  const notFulfilled = promiseStates.find(promiseState => !promiseState.fulfilled);
  return !Boolean(notFulfilled);
};
