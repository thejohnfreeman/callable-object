const { callable } = require('./javascript')

const object_ = { y: 1 }
const function_ = function (x) { return x + this.y }
const proxy = callable(object_, function_)

console.log('proxy == ', proxy)
console.log('proxy(2) ==', proxy(2))
console.log('Object.keys(proxy) == ', Object.keys(proxy))
console.log('Reflect.ownKeys(proxy) == ', Reflect.ownKeys(proxy))
