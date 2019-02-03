// Confusing name. This is a proxy handler that proxies an object and
// a function, effectively making a "callable object".
// https://github.com/Microsoft/TypeScript/issues/183
class CallableObjectHandler {
  constructor(object_, function_) {
    this.object_ = object_
    this.function_ = function_
  }

  apply(_target, _context, args) {
    return this.function_.apply(this.object_, args)
  }

  defineProperty(_target, property, descriptor) {
    return Reflect.defineProperty(this.object_, property, descriptor)
  }

  deleteProperty(_target, property) {
    return Reflect.deleteProperty(this.object_, property)
  }

  get(_target, property, receiver) {
    return Reflect.get(this.object_, property, receiver)
  }

  getOwnPropertyDescriptor(_target, property) {
    return Reflect.getOwnPropertyDescriptor(this.object_, property)
  }

  getPrototypeOf(_target) {
    return Reflect.getPrototypeOf(this.object_)
  }

  has(_target, property) {
    return Reflect.has(this.object_, property)
  }

  isExtensible(_target) {
    return Reflect.isExtensible(this.object_)
  }

  ownKeys(_target) {
    return Reflect.ownKeys(this.object_)
  }

  preventExtensions(_target) {
    return Reflect.preventExtensions(this.object_)
  }

  set(_target, property, value, receiver) {
    return Reflect.set(this.object_, property, value, receiver)
  }

  setPrototypeOf(_target, prototype) {
    return Reflect.setPrototypeOf(this.object_, prototype)
  }
}

// A proxy is not callable unless its target is callable.
// https://stackoverflow.com/a/32360219/618906
// To guarantee our target is callable, we use a dummy function, which means
// we have to override every proxy trap to redirect them to our real target
// object. We can use `Reflect` to help.

// If we use a dummy function declared as a function or function expression,
// then it will have non-configurable properties `prototype` and `arguments`
// that we must include in our own properties.
// https://stackoverflow.com/a/42876020/618906
// If we use an arrow function instead, it only has configurable properties
// `name` and `length`.

function callable(object_, function_) {
  const handler = new CallableObjectHandler(object_, function_)
  return new Proxy(() => {}, handler)
}

module.exports = {
  CallableObjectHandler,
  callable,
}
