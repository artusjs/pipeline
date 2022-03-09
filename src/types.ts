export interface ParamsDictionary {
  [key: string]: any;
}

export interface BaseRequest<P = ParamsDictionary> {
  params: P
};

export interface BaseResponse<P = ParamsDictionary> {
  data: P
};

export interface BaseContext {
  req?: BaseRequest,
  res?: BaseResponse,
  namespace: (namespace: string) => ContextStorage<any>,
};

export type ContextStorage<T> = {
  set: (value: T, key: string | symbol) => void,
  get: (key: string | symbol) => T
};
export type Next = () => Promise<any>;

export type Middleware = (context: BaseContext, next: Next) => void;
export type Middlewares = Middleware[];
export type MiddlewareInput = Middleware | Middlewares | { middleware: Middleware };
