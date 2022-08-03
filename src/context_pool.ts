import { Reusify } from "./reusify";
import { Context } from './base';
import { BaseContext, BaseInput, BaseOutput } from "./types";
import type { ExecutionContainer } from "@artus/injection";

export class ContextPool {
  private pool: Reusify<BaseContext>;
  private contextFactory: () => BaseContext;
  constructor(max?: number, ctxFactory?: () => BaseContext) {
    this.contextFactory = ctxFactory ?? (() => {
      return new Context();
    });
    this.pool = new Reusify({ max: max || 100, factory: this.contextFactory });
  }

  get(container: ExecutionContainer, input?: BaseInput, output?: BaseOutput): BaseContext {
    const ctx = this.pool.get();
    ctx.container = container;
    ctx.input = input ?? ctx.input;
    ctx.output = output ?? ctx.output;
    return ctx;
  }

  release(ctx: BaseContext) {
    ctx.restore?.();
    this.pool.release(ctx);
  }
}