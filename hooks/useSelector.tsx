import { useStore, State, Selector } from '../lib/fakedux';
import * as store from '../store';

export const useSelector = <V extends any>(
  selector: Selector<State, V>
  // compareFn: (oldValue: V, newValue: V) => boolean = (oldValue, newValue) =>
  //   oldValue === newValue
) => {
  const newValue = useStore(store, selector);

  return [newValue, store.setState] as [V, typeof store.setState];
};
