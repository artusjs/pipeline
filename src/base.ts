import type { ExecutionContainer } from '@artus/injection';
import { BaseContext, BaseInput, BaseOutput, ContextStorage, ParamsDictionary, Next } from './types';

const ContextStorageSymbol = Symbol('ARTUS::ContextStorage');

export class Input implements BaseInput {
  public params: ParamsDictionary = new Map();
}

export class Output implements BaseOutput {
  public data: ParamsDictionary = new Map();
}

export class Storage implements ContextStorage<any> {
  private storageMap = new Map();

  get(key?: string | symbol): any {
    key ??= ContextStorageSymbol;
    return this.storageMap.get(key);
  }

  set(value: any, key?: string | symbol): void {
    key ??= ContextStorageSymbol;
    this.storageMap.set(key, value);
  }
}

export class Context implements BaseContext {
  public input: Input = new Input();
  public output: Output = new Output();

  private _container!: ExecutionContainer;
  private storageMap = new Map<string, ContextStorage<any>>();

  constructor(input?: Input, output?: Output) {
    this.input = input ?? this.input;
    this.output = output ?? this.output;
  }

  get container() {
    return this._container;
  }

  set container(container: ExecutionContainer) {
    this._container = container;
  }

  namespace(namespace: string): ContextStorage<any> {
    let storage = this.storageMap.get(namespace);
    if (!storage) {
      storage = new Storage();
      this.storageMap.set(namespace, storage);
    }

    return storage;
  }

  restore() {
    this.storageMap.clear();
    this.input.params.clear();
    this.output.data.clear();
    this.container = null as any;
  }
}

export type Middleware<T extends BaseContext = any> = (context: T, next: Next) => void;
export type Middlewares = Middleware[];
export type PipelineLike = { middlewares: Middlewares };
export type MiddlewareInput = Middleware | Middlewares | PipelineLike;
