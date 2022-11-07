import * as React from 'react';

export const createStore = <State extends Record<string, unknown>>(
  initialState: State
) => {
  let state = initialState;
  const getState = () => state;
  const listeners = new Set<Function>();

  const setState = (
    fn: (state: typeof initialState) => typeof initialState
  ) => {
    state = fn(state);
    listeners.forEach((l) => l());
  };

  const subscribe = (listener: Function) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return { getState, setState, subscribe };
};

export type Store = ReturnType<typeof createStore>;
export type State = Record<string, unknown>;
export type Selector<S extends Record<string, unknown> = State, V = any> = (
  state: S
) => V;

export const useStore = <
  S extends Store,
  ST extends Record<string, unknown> = ReturnType<S['getState']>
>(
  store: S,
  selector: Selector<ST, any>
) => {
  return React.useSyncExternalStore<ST>(
    store.subscribe,
    React.useCallback(() => selector(store.getState() as ST), [store, selector])
  );
};

export const createSelector = <ST extends State, V = any>(
  selector: Selector<ST, V>
) => selector;
