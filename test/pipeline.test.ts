import assert from 'assert';
import { Pipeline, Context, Next } from "../src";

describe('test/pipeline.test.ts', () => {
  it('run pipeline ok with middleware', async () => {
    const pipeline = new Pipeline();

    pipeline.use(async function (ctx: Context, next: Next): Promise<void> {
      ctx.namespace('test').set('before');
      await next();
      assert(ctx.namespace('test').get() === 'after');
    });

    pipeline.use(async function (ctx: Context, next: Next): Promise<void> {
      assert(ctx.namespace('test').get() === 'before');
      await next();
      ctx.namespace('test').set('after');
    });

    pipeline.use(async function (ctx: Context): Promise<void> {
      const { data } = ctx.output;
      data.set('responseValue', 1);
    });

    const ctx = new Context();
    await pipeline.run(ctx);
    await pipeline.run(ctx);

    const { data } = ctx.output;
    assert(data.get('responseValue') === 1);
  });

  it('run pipeline ok with middlewares', async () => {
    const pipeline = new Pipeline();

    pipeline.use([
      async function (ctx: Context, next: Next): Promise<void> {
        ctx.namespace('test').set('before');
        await next();
        assert(ctx.namespace('test').get() === 'after');
      },

      async function (ctx: Context, next: Next): Promise<void> {
        assert(ctx.namespace('test').get() === 'before');
        await next();
        ctx.namespace('test').set('after');
      },

      async function (ctx: Context): Promise<void> {
        const { data } = ctx.output;
        data.set('responseValue', 1);
      },
    ]);

    const ctx = new Context();
    await pipeline.run(ctx);

    const { data } = ctx.output;
    assert(data.get('responseValue') === 1);
  });

  it('run pipeline ok with pipeline', async () => {
    const pipeline = new Pipeline();

    pipeline.use(async function (ctx: Context, next: Next): Promise<void> {
      ctx.namespace('test').set('before');
      await next();
      assert(ctx.namespace('test').get() === 'after');
    });

    pipeline.use(async function (ctx: Context, next: Next): Promise<void> {
      assert(ctx.namespace('test').get() === 'before');
      await next();
      ctx.namespace('test').set('after');
    });

    pipeline.use(async function (ctx: Context): Promise<void> {
      const { data } = ctx.output;
      data.set('responseValue', 1);
    });

    const pipeline2 = new Pipeline();
    pipeline2.use(pipeline);
    const ctx = new Context();
    await pipeline2.run(ctx);

    const { data } = ctx.output;
    assert(data.get('responseValue') === 1);
  });

  it('run pipeline falied if next() called multiple times', async () => {
    const pipeline = new Pipeline();

    pipeline.use([
      async function (_: Context, next: Next): Promise<void> {
        await next();
        await next();
      },

      async function (ctx: Context): Promise<void> {
        const { data } = ctx.output;
        data.set('responseValue', 1);
      },
    ]);

    const ctx = new Context();
    let error = '';
    try {
      await pipeline.run(ctx);
    } catch (err: any) {
      error = err.message;
    }
    assert(error === 'next() called multiple times');
  });

  it('run pipeline falied if middleware throw', async () => {
    const pipeline = new Pipeline();

    pipeline.use([
      async function (_: Context, next: Next): Promise<void> {
        await next();
        throw new Error('mock error');
      },

      async function (ctx: Context): Promise<void> {
        const { data } = ctx.output;
        data.set('responseValue', 1);
      },
    ]);

    const ctx = new Context();
    let error = '';
    try {
      await pipeline.run(ctx);
    } catch (err: any) {
      error = err.message;
    }
    assert(error === 'mock error');
  });
});
