import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export type InputFactory<State> = (
  state$: Observable<State>
) => Observable<State>;

export type InputFactoryWithInputs<State, Inputs> = (
  state$: Observable<State>,
  inputs$: Observable<Inputs>
) => Observable<State>;

export const createStore = <
  State extends Record<string, unknown>,
  Inputs extends ReadonlyArray<any>
>(
  inputFactory: InputFactoryWithInputs<State, Inputs>,
  initialState?: State
) => {
  const state$ = new BehaviorSubject<State | undefined>(initialState);

  state$.complete();

  const subscribe = () => {
    let output$: Observable<State>;

    output$ = (
      inputFactory as unknown as (
        state$: Observable<State | undefined>
      ) => Observable<State>
    )(state$);

    return (onStorageChange: () => void) => {
      const subscription = output$
        .pipe(tap((s) => state$.next(s)))
        .subscribe(onStorageChange);
      return () => subscription.unsubscribe();
    };
  };

  const getState = () => state$.getValue();

  return { getState, setState: undefined, subscribe };
};
