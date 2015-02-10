# FauxJax

Provides a fake implementation of [XMLHttpRequest])(https://xhr.spec.whatwg.org/).

```sh
npm install faux-jax --save[-dev]
```

# Example

```js
var FauxJax = require('faux-jax');
var xhr = new FauxJax();

xhr.open('POST', '/dawg');
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(
  JSON.stringify({
    YAW: 'dawg'
  }
));

xhr.respond(200, {
  'Content-Type': 'application/json'
}, '{"zup": "bro?"}');

console.log(xhr.response);
// '{"zup": "bro?"}'
```

# API

## var xhr = new FauxJax();

Same as [XMLHttpRequest's constructor](https://xhr.spec.whatwg.org/#dom-xmlhttprequest).

We follow [the spec](https://xhr.spec.whatwg.org/#interface-xmlhttprequest).

`FauxJax` is a fake implementation so we added some more methods and properties.

## xhr.url

## xhr.requestHeaders

## xhr.responseHeaders

## xhr.requestBody

## xhr.respond(status, [headers], [body])

## xhr.setResponseHeaders(headers)

## xhr.setResponseBody(body)

# Development

```sh
npm run dev
```

[Tests](./test/) are written with [tape](https://github.com/substack/tape) and run through [zuul](http://localhost:8080/__zuul).

# Lint

```sh
npm run lint
```

Uses [eslint](http://eslint.org/), see [.eslintrc](./.eslintrc).
