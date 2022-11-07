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
export type Selector<S = any, V = any> = (state: S) => V;

export const useStore = <S extends Store, ST = ReturnType<S['getState']>>(
  store: S,
  selector: Selector<ST, any>
) => {
  return React.useSyncExternalStore<ST>(
    store.subscribe,
    React.useCallback(() => selector(store.getState() as ST), [store, selector])
  );
};

export const createSelector = <FN extends (state: State) => any>(
  selector: FN
) => selector;

export const createUseSelector = <
  S extends Store,
  ST extends ReturnType<S['getState']>
>(
  store: S
) => {
  const useSelector = <V extends any>(
    selector: Selector<ST, V>
    // compareFn: (oldValue: V, newValue: V) => boolean = (oldValue, newValue) =>
    //   oldValue === newValue
  ): [V, (fn: (state: ST) => ST) => void] => {
    const newValue = useStore(store, selector);

    return [newValue as V, store.setState as (fn: (state: ST) => ST) => void];
  };

  return useSelector;
};
