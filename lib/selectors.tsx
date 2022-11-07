import { useStore, State, Selector } from '../lib/createStore';
import * as store from '../store';

export const createSelector = <ST extends State, V = any>(
  selector: Selector<ST, V>
) => selector;

export const useSelector = <V extends any>(
  selector: Selector<State, V>,
  compareFn: (oldValue: V, newValue: V) => boolean = (oldValue, newValue) =>
    oldValue === newValue
) => {
  const newValue = useStore(store, selector);

  return [newValue, store.setState] as [V, typeof store.setState];
};
