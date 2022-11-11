import * as React from 'react';
import { Store } from './fakedux-types';

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
