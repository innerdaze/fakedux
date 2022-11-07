import { createStore, createUseSelector } from './lib/fakedux';

const initialState = {
  actions: { clicks: 0 },
  meta: {
    status: 'ready',
  },
};

const store = createStore(initialState);

export type StoreType = typeof initialState;
export const { getState, setState, subscribe } = store;
export const useSelector = createUseSelector(store);
