// For some reason, the TypeScript compilation of this module does not work
// the same as the hand-written JavaScript in the file next door.
// TODO: Investigate.
export class CallableObjectHandler<T extends object, A extends any[], R> {
  public constructor(
    public readonly object_: T,
    public readonly function_: (this: T, ...args: A) => R,
  ) {}

  public apply(_target, context, args: any[]) {
    if (context) {
      // Did someone bind this?
      console.error('unexpected context for callable object')
    }
    return this.function_.apply(this.object_, args)
  }

  public construct(_target, args: any[]) {
    return this.function_.apply(this.object_, args)
  }

  public defineProperty(_target, property, descriptor) {
    return Reflect.defineProperty(this.object_, property, descriptor)
  }

  public deleteProperty(_target, property) {
    return Reflect.deleteProperty(this.object_, property)
  }

  // What is "receiver"?
  public get(_target, property, receiver) {
    return Reflect.get(this.object_, property, receiver)
  }

  public getOwnPropertyDescriptor(_target, property) {
    return Reflect.getOwnPropertyDescriptor(this.object_, property)
  }

  public getPrototypeOf(_target) {
    return Reflect.getPrototypeOf(this.object_)
  }

  public has(_target, property) {
    return Reflect.has(this.object_, property)
  }

  public isExtensible(_target) {
    return Reflect.isExtensible(this.object_)
  }

  public ownKeys(_target) {
    return Reflect.ownKeys(this.object_)
  }

  public preventExtensions(_target) {
    return Reflect.preventExtensions(this.object_)
  }

  public set(_target, property, value, receiver) {
    return Reflect.set(this.object_, property, value, receiver)
  }

  public setPrototypeOf(_target, prototype) {
    return Reflect.setPrototypeOf(this.object_, prototype)
  }
}

export function callable(
  object_,
  function_,
): typeof object_ & typeof function_ {
  const handler = new CallableObjectHandler(object_, function_)
  return new Proxy(() => {}, handler)
}
