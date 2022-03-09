export interface ParamsDictionary {
  [key: string]: any;
}

export interface BaseInput<P = ParamsDictionary> {
  params: P
};

export interface BaseOutput<P = ParamsDictionary> {
  data: P
};

export interface BaseContext {
  input: BaseInput,
  output: BaseOutput,
  namespace: (namespace: string) => ContextStorage<any>,
};

export type ContextStorage<T> = {
  set: (value: T, key?: string | symbol) => void,
  get: (key?: string | symbol) => T
};
export type Next = () => Promise<any>;
