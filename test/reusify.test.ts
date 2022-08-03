import { Reusify } from '../src/reusify';

describe("test/reusify.test.ts", () => {
  it("should init ok", () => {
    const pool = new Reusify({ max: 2, factory: jest.fn(() => ({})) });
    expect(pool.max).toBe(2);
    expect(pool.count).toBe(1);
  });

  it('should get ok', () => {
    class A { }
    const pool = new Reusify({
      max: 1,
      factory: jest.fn(() => {
        return new A();
      }),
    });
    expect(pool.get()).toBeInstanceOf(A);
    expect(pool.count).toBe(1);
  });

  it('should release ok', () => {
    const pool = new Reusify({
      max: 2,
      factory: jest.fn(() => ({})),
    });
    const obj2 = pool.get();
    pool.release(obj2);
    expect(pool.count).toBe(2);
  });

  it('should release fail when count greater than max', () => {
    const pool = new Reusify({ max: 2, factory: jest.fn(() => ({})) });
    const obj1 = pool.get();
    const obj2 = pool.get();
    const obj3 = pool.get();
    pool.release(obj1);
    pool.release(obj2);
    pool.release(obj3);
    expect(pool.count).toBe(2);
    pool.get();
    expect(pool.count).toBe(1);
  });
});