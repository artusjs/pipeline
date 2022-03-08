
const ContextMapSymbol = Symbol('ARTUS::ContextMap')

export interface ParamsDictionary {
  [key: string]: string;
}

export type BaseRequest<P = ParamsDictionary> = {
  params: P
};

export type BaseResponse<P = ParamsDictionary> = {
  data: P
};

export type ContextStorage<T> = {
  [ContextMapSymbol]: T,
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

export class Pipeline {
  private middlewares: Middlewares;
  constructor() {
    this.middlewares = [];
  }

  use(middleware: MiddlewareInput) {
    if (typeof middleware === 'function') {
      this.middlewares.push(middleware);
      return;
    }

    if (Array.isArray(middleware)) {
      middleware.map(this.use);
      return;
    }

    if (typeof middleware.middleware === 'function') {
      this.use(middleware.middleware);
      return;
    }
  }
}
