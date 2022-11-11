import { interval, merge, scan, Subject } from 'rxjs';
import { createUseSelector } from './lib/fakedux';
import { createStore } from './lib/fakedux-store-rxjs';

const observable = interval(1000);
const action$ = new Subject<any>();
const subscription = observable.subscribe((x) => action$.next({ count: x }));
const subscriptionX2 = observable.subscribe((x) =>
  action$.next({ countX2: x * 2 })
);

const actionStream = merge(action$, subscription, subscriptionX2);

const initialState = {
  count: 0,
  countX2: 0,
};

const stream = actionStream.pipe(
  scan((state, payload) => ({ ...state, ...payload }), initialState)
);

const store = createStore(() => stream, initialState);

export type StoreType = typeof initialState;
export const { getState, setState, subscribe } = store;
export const useStreamSelector = createUseSelector(store);
