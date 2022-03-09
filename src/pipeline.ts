
const ContextStorageSymbol = Symbol('ARTUS::ContextStorage');

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

export class Pipeline {
  private readonly middlewares: Middlewares;
  private index: number;

  constructor() {
    this.middlewares = [];
    this.index = -1;
  }

  use(middleware: MiddlewareInput) {
    if (typeof middleware === 'function') {
      this.middlewares.push(middleware);
      return;
    }

    if (Array.isArray(middleware)) {
      middleware.forEach(this.use);
      return;
    }

    if (typeof middleware.middleware === 'function') {
      this.use(middleware.middleware);
      return;
    }
  }

  private dispatch(i: number, ctx: BaseContext<any>): Promise<any> {
    if (i <= this.index) return Promise.reject(new Error('next() called multiple times'));
    this.index = i;
    let fn = this.middlewares[i];
    if (!fn) return Promise.resolve();
    try {
      return Promise.resolve(fn(ctx, this.dispatch.bind(this, i + 1, ctx)));
    } catch (err: any) {
      return Promise.reject(err);
    }
  }

  run(ctx: BaseContext<any>) {
    return this.dispatch(0, ctx);
  }
}
