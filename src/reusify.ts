
const next = Symbol('next');

export interface ReusifyOptions<T> {
  max: number;
  factory: () => T;
}

export class Reusify<T = any> {
  public max: number;
  public count: number;

  private head: T;
  private tail: T;
  private factory: () => T;

  constructor(options: ReusifyOptions<T>) {
    this.factory = options.factory;
    this.max = options.max;
    this.count = 0;
    this.head = this.getInstance();
    this.tail = this.head;
  }

  public get() {
    const current = this.head;
    if (current[next]) {
      this.head = current[next];
    } else {
      this.head = this.getInstance();
      this.tail = this.head;
    }
    current[next] = null;
    this.count--;
    return current;
  }

  public release(obj: T) {
    if (this.count >= this.max) {
      return;
    }
    this.tail[next] = obj;
    this.tail = obj;
    this.count++;
  }

  private getInstance() {
    this.count++;
    return this.factory();
  }
}