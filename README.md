# callable-object

Function call operators for JavaScript objects.

<!-- [![npm](https://img.shields.io/npm/v/@thejohnfreeman/callable-object.svg)](https://www.npmjs.com/package/@thejohnfreeman/callable-object) -->
[![code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![build status](https://travis-ci.org/thejohnfreeman/callable-object.svg?branch=master)](https://travis-ci.org/thejohnfreeman/callable-object)

## Motivation

The API can be cleaned up, but for now this is a proof-of-concept. Given an
object and a function, return a proxy for the object that can be called like
the function. Inspired by a
[TypeScript issue](https://github.com/Microsoft/TypeScript/issues/183).


## Related work

- [callable-object](https://www.npmjs.com/package/callable-object)
- [callable-instance](https://www.npmjs.com/package/callable-instance)
- [callable-instance2](https://www.npmjs.com/package/callable-instance2): This
  might just be a republished copy of `callable-instance`.
- [invokable](https://www.npmjs.com/package/invokable)
- [How to extend Function with ES6 classes?](https://stackoverflow.com/q/36871299/618906)


## Caveats

[A proxy is not callable unless its target is
callable.](https://stackoverflow.com/a/32360219/618906) To guarantee our
target is callable, we use a dummy function, which means we have to override
every proxy trap to redirect them to our real target object. We can use
[`Reflect`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
to help.

If we use a dummy function declared as a function or function expression, then
it will have non-configurable properties `prototype` and `arguments` that [we
must include in our own
properties](https://stackoverflow.com/a/42876020/618906). If we use an arrow
function instead, it only has configurable properties `name` and `length`.

My implementation here works in JavaScript, but not in TypeScript. I don't
know why.

If you have a method that returns `this`, it will not return the proxy unless
you manage it yourself: store a reference to the proxy, return it instead of
`this`, and initialize it with the proxy after constructing both the object
and the proxy.
