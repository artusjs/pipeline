import { ContextPool } from '../src/context_pool';

describe('test/context_pool.test.ts', () => {
  it('should get ok', () => {
    const ctxPool = new ContextPool(1);
    const container = new Map();
    const ctx = ctxPool.get(container as any);
    expect(ctx.container).toBe(container);
    expect(ctx.input.params).toBeInstanceOf(Map);
    expect(ctx.output.data).toBeInstanceOf(Map);
  });

  it('should release ok', () => {
    const ctxPool = new ContextPool(1);
    const container = new Map();
    const ctx = ctxPool.get(container as any);
    ctx.input.params!.set('id', 12);
    ctx.output.data!.set('user', { id: 12 });
    ctxPool.release(ctx);
    const container2 = new Map();
    const ctx2 = ctxPool.get(container2 as any);
    expect(ctx2.container).toBe(container2);
    expect(ctx.input.params!.has('id')).toBe(false);
    expect(ctx.output.data!.has('user')).toBe(false);
  });
});
