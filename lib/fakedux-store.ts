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
