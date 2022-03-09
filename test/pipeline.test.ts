import assert from 'assert';
import { Pipeline, Context } from "../src";

describe('test/pipeline.test.ts', () => {
  it('run pipeline ok with middleware', async () => {
    const pipeline = new Pipeline();

    const ctx = new Context();
    await pipeline.run(ctx);
  });
});
