import { createStore } from './lib/createStore';

const initialState = {
  actions: { clicks: 0 },
  meta: {
    status: 'ready',
  },
};

export type StoreType = typeof initialState;
export const { getState, setState, subscribe } = createStore(initialState);
