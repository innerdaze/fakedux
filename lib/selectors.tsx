import * as React from 'react';
import { useStore, State, Selector } from '../lib/createStore';
import * as store from '../store';

export const createSelector = <ST extends State>(selector: Selector<ST>) =>
  selector;

export const useSelector = <ST extends State, V = ReturnType<Selector<ST>>>(
  selector: Selector<ST, V>,
  compareFn: (oldValue: V, newValue: V) => boolean = (oldValue, newValue) =>
    oldValue === newValue
) => {
  const newValue = useStore(store, selector);

  return [newValue, store.setState] as [V, typeof store.setState];
};
