import assert from 'assert';
import { Pipeline, Context, Next } from "../src";

describe('test/pipeline.test.ts', () => {
  it('run pipeline ok with middleware', async () => {
    const pipeline = new Pipeline();

    pipeline.use(async function (ctx: Context, next: Next): Promise<void> {
      ctx.namespace('test').set(22222);
      await next();
    });

    pipeline.use(async function (ctx: Context, next: Next): Promise<void> {
      assert(ctx.namespace('test').get() === 22222);

      const { data } = ctx.output;
      data.set('responseValue', 1);
    });

    const ctx = new Context();
    await pipeline.run(ctx);

    const { data } = ctx.output;
    assert(data.get('responseValue') === 1);
  });

  it('run pipeline ok with middlewares', async () => {
    const pipeline = new Pipeline();

    pipeline.use([
      async function (ctx: Context, next: Next): Promise<void> {
        ctx.namespace('test').set(22222);
        await next();
      },
      async function (ctx: Context, next: Next): Promise<void> {
        assert(ctx.namespace('test').get() === 22222);

        const { data } = ctx.output;
        data.set('responseValue', 1);
      }
    ]);

    const ctx = new Context();
    await pipeline.run(ctx);

    const { data } = ctx.output;
    assert(data.get('responseValue') === 1);
  });

  it('run pipeline ok with { middleware: middleware }', async () => {
    const pipeline = new Pipeline();

    pipeline.use({
      middleware: async function (ctx: Context, next: Next): Promise<void> {
        ctx.namespace('test').set(22222);
        await next();
      }
    });

    pipeline.use({
      middleware: async function (ctx: Context, next: Next): Promise<void> {
        assert(ctx.namespace('test').get() === 22222);

        const { data } = ctx.output;
        data.set('responseValue', 1);
      }
    });

    const ctx = new Context();
    await pipeline.run(ctx);

    const { data } = ctx.output;
    assert(data.get('responseValue') === 1);
  });
});
