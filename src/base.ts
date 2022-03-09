import {
  BaseContext, BaseRequest, BaseResponse,
  ContextStorage, ParamsDictionary
} from "./types";

const ContextStorageSymbol = Symbol('ARTUS::ContextStorage');

export class Request implements BaseRequest {
  public params: ParamsDictionary = new Map();
}

export class Response implements BaseResponse {
  public data: ParamsDictionary = new Map();
}

export class Storage implements ContextStorage<any>{
  #storageMap = new Map();

  get(key: string | symbol): any {
    key ??= ContextStorageSymbol;
    return this.#storageMap.get(key);
  }

  set(value: any, key: string | symbol): void {
    key ??= ContextStorageSymbol;
    this.#storageMap.set(key, value);
  }
}

export class Context implements BaseContext {
  public req: BaseRequest = new Request();
  public res: BaseResponse = new Response();
  #stogrageMap = new Map<string, ContextStorage<any>>();

  namespace(namespace: string): ContextStorage<any> {
    let storage = this.#stogrageMap.get(namespace);
    if (!storage) {
      storage = new Storage();
    }

    return storage;
  };
}
