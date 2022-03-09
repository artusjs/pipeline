
import { Context, Middlewares, MiddlewareInput } from "./base";

export * from "./types";
export * from "./base";

export class Pipeline {
  #middlewares: Middlewares = [];
  #index: number = -1;

  use(middleware: MiddlewareInput) {
    if (typeof middleware === 'function') {
      this.#middlewares.push(middleware);
      return;
    }

    if (Array.isArray(middleware)) {
      middleware.forEach(this.use.bind(this));
      return;
    }

    if (typeof middleware.middleware === 'function') {
      this.use(middleware.middleware);
      return;
    }
  }

  #dispatch(i: number, ctx: Context): Promise<any> {
    if (i <= this.#index) return Promise.reject(new Error('next() called multiple times'));
    this.#index = i;
    let fn = this.#middlewares[i];
    if (!fn) return Promise.resolve();
    try {
      return Promise.resolve(fn(ctx, this.#dispatch.bind(this, i + 1, ctx)));
    } catch (err: any) {
      return Promise.reject(err);
    }
  }

  run(ctx: Context): Promise<any> {
    return this.#dispatch(0, ctx);
  }
}
