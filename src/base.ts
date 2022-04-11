import { Container, ExecutionContainer } from '@artus/injection';
import {
  BaseContext, BaseInput, BaseOutput,
  ContextStorage, ParamsDictionary, Next, ContextInitOptions
} from './types';

const DEFAULT_EXECUTION_CONTAINER_NAME = 'artus#execution';
const ContextStorageSymbol = Symbol('ARTUS::ContextStorage');

export class Input implements BaseInput {
  public params: ParamsDictionary = new Map();
}

export class Output implements BaseOutput {
  public data: ParamsDictionary = new Map();
}

export class Storage implements ContextStorage<any>{
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
  public input: BaseInput = new Input();
  public output: BaseOutput = new Output();

  // 不建议对外使用
  public container: ExecutionContainer;
  private storageMap = new Map<string, ContextStorage<any>>();

  constructor(input?: Input, output?: Output, opts?: ContextInitOptions) {
    this.input = input ?? this.input;
    this.output = output ?? this.output;

    this.container = new ExecutionContainer(
      this,
      opts?.parentContainer ?? new Container(DEFAULT_EXECUTION_CONTAINER_NAME)
    );
  }

  namespace(namespace: string): ContextStorage<any> {
    let storage = this.storageMap.get(namespace);
    if (!storage) {
      storage = new Storage();
      this.storageMap.set(namespace, storage);
    }

    return storage;
  };
}

export type Middleware = (context: Context, next: Next) => void;
export type Middlewares = Middleware[];
export type PipelineLike = { middlewares: Middlewares };
export type MiddlewareInput = Middleware | Middlewares | PipelineLike;
