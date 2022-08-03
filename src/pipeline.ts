import { Middlewares, MiddlewareInput, PipelineLike } from './base';
import { BaseContext } from './types';

export class Pipeline implements PipelineLike {
  middlewares: Middlewares = [];

  use(middleware: MiddlewareInput) {
    if (typeof middleware === 'function') {
      this.middlewares.push(middleware);
      return;
    }

    if (Array.isArray(middleware)) {
      for (const mid of middleware) {
        this.use(mid);
      }
      return;
    }

    // eg. pipeline1.use(pipeline2)
    if (middleware.middlewares) {
      this.use(middleware.middlewares);
      return;
    }

    throw new Error(`${middleware} isn't type MiddlewareInput`);
  }

  dispatch(i: number, ctx: BaseContext, execution = { index: -1 }): Promise<any> {
    if (i <= execution.index) return Promise.reject(new Error('next() called multiple times'));
    execution.index = i;
    const fn = this.middlewares[i];
    if (!fn) return Promise.resolve();
    try {
      return Promise.resolve(fn(ctx, this.dispatch.bind(this, i + 1, ctx, execution)));
    } catch (err: any) {
      return Promise.reject(err);
    }
  }

  run(ctx: BaseContext): Promise<any> {
    return this.dispatch(0, ctx);
  }
}
