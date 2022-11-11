export type Store = {
  getState: () => Record<string, unknown>;
  setState: (
    fn: (state: Record<string, unknown>) => Record<string, unknown>
  ) => void;
  subscribe: (listener: Function) => (() => void) | any;
};

export type State = Record<string, unknown>;
