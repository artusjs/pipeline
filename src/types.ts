const ContextStorageSymbol = Symbol('ARTUS::ContextStorage');

export interface ParamsDictionary {
  [key: string]: any;
}

export type BaseRequest<P = ParamsDictionary> = {
  params: P
};

export type BaseResponse<P = ParamsDictionary> = {
  data: P
};

export type ContextStorage<T> = {
  [ContextStorageSymbol]: T,
  set: (value: T) => void,
  get: () => T
};

export type BaseContext<T> = {
  req?: BaseRequest,
  res?: BaseResponse,
  namespace: (namespace: string) => ContextStorage<T>,
};

export type Next = () => Promise<any>;

export type Middleware = (context: any, next: Next) => void;
export type Middlewares = Middleware[];
export type MiddlewareInput = Middleware | Middlewares | { middleware: Middleware };
