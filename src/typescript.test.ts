describe('Proxy', () => {
  describe('with object target', () => {
    it('cannot trap apply', () => {
      const object_ = { y: 1 }
      const function_ = x => x + 1
      // We have to assert the proxy has type `any`, or else TypeScript knows
      // that it is not callable and diagnoses an error.
      const proxy: any = new Proxy(object_, {
        apply(_target, _context, args) {
          return function_.apply(object_, args)
        },
      })
      expect(() => proxy(2)).toThrow(TypeError)
      // It complains that the object is not callable.
      expect(() => proxy(2)).toThrow(/is not a function/)
    })
  })

  describe('with non-arrow function target', () => {
    it('can trap apply', () => {
      const function_ = x => x + 1
      const proxy: typeof function_ = new Proxy(function() {}, {
        apply(_target, _context, args) {
          return function_.apply(null, args)
        },
      })
      expect(proxy(2)).toEqual(3)
    })

    it('cannot trap ownKeys, for Reflect.ownKeys', () => {
      const object_ = { y: 1 }
      const proxy = new Proxy(function() {}, {
        ownKeys(_target) {
          return Reflect.ownKeys(object_)
        },
      })
      expect(() => Reflect.ownKeys(proxy)).toThrow(TypeError)
      // It complains that the object is missing a non-configurable property
      // that the function has.
      expect(() => Reflect.ownKeys(proxy)).toThrow(/arguments/)
    })
  })

  describe('with arrow function target', () => {
    it('can trap apply', () => {
      const function_ = x => x + 1
      const proxy: typeof function_ = new Proxy(() => {}, {
        apply(_target, _context, args) {
          return function_.apply(null, args)
        },
      })
      expect(proxy(2)).toEqual(3)
    })

    it('can trap apply, with context', () => {
      const object_ = { y: 1 }
      const function_ = function(x) {
        return x + this.y
      }
      const proxy: typeof function_ = new Proxy(() => {}, {
        apply(_target, _context, args) {
          return function_.apply(object_, args)
        },
      })
      expect(proxy(2)).toEqual(3)
    })

    // These skipped tests fail in TypeScript, but not in JavaScript.
    it('can trap ownKeys, for Reflect.ownKeys', () => {
      const object_ = { y: 1 }
      const proxy = new Proxy(() => {}, {
        getOwnPropertyDescriptor(_target, property) {
          return Reflect.getOwnPropertyDescriptor(object_, property)
        },
        ownKeys(_target) {
          return Reflect.ownKeys(object_)
        },
      })
      expect(Reflect.ownKeys(proxy)).toEqual(['y'])
    })

    it('can trap ownKeys, for Object.keys', () => {
      const object_ = { y: 1 }
      const proxy = new Proxy(() => {}, {
        getOwnPropertyDescriptor(_target, property) {
          return Reflect.getOwnPropertyDescriptor(object_, property)
        },
        ownKeys(_target) {
          return Reflect.ownKeys(object_)
        },
      })
      expect(Object.keys(proxy)).toEqual(['y'])
    })

    it('can trap ownKeys, for console.log', () => {
      const object_ = { y: 1 }
      const proxy = new Proxy(() => {}, {
        getOwnPropertyDescriptor(_target, property) {
          return Reflect.getOwnPropertyDescriptor(object_, property)
        },
        ownKeys(_target) {
          return Reflect.ownKeys(object_)
        },
      })
      console.log(proxy)
    })
  })
})
