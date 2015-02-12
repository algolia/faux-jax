# faux-jax <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![Build Status][travis-svg]][travis-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

Intercept and respond to Ajax requests.

Dedicated to testing Ajax-dependent JavaScript applications.

We intercept both [XMLHttpRequest](https://xhr.spec.whatwg.org/) and
[XDomainRequest](https://msdn.microsoft.com/en-us/library/ie/cc288060(v=vs.85).aspx)
requests in [compatible environments](#how).

```sh
npm install faux-jax --save[-dev]
```

# Example

```js
var fauxJax = require('faux-jax');

fauxJax.install();
var xhr = new XMLHttpRequest();

xhr.open('POST', '/dawg');
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(
  JSON.stringify({
    YAW: 'dawg'
  })
);

xhr.respond(
  200, {
    'Content-Type': 'application/json'
  },
  '{"zup": "bro?"}'
);

console.log(fauxJax.requests[0].response);
// '{"zup": "bro?"}'

console.log(fauxJax.requests[0].requestHeaders);
// {'Content-Type': 'application/json'}

fauxJax.restore();

console.log(fauxJax.requests.length);
// 0
```

# API

## fauxJax.install()

Replace global `XMLHttpRequest` and `XDomainRequest` with mocks.

## fauxJax.requests

Populated with every `new XMLHttpRequest()` or `new XDomainRequest()`.

All requests have the native properties/methods from [the spec](https://xhr.spec.whatwg.org/).

We also added a couple of handy properties/methods for you to ease testing.

### request.requestMethod

### request.requestURL

### request.requestHeaders

Always `{}` with `XDomainRequest`.

### request.requestBody

### request.respond(status, [headers], [body])

### request.setResponseHeaders(headers)

### request.setResponseBody(body)

## fauxJax.restore()

Sets back global `XMLHttpRequest` and `XDomainRequest` to native implementations.

# How

tl;dr; We try to be as close as possible to the mocked native environement.

`faux-jax` uses [feature detection](./lib/support) to only expose what's relevant for the current environment.

i.e. on Chrome, we do not intercept nor expose `XDomainRequest`.

Also if the browser only implement [some parts](https://dvcs.w3.org/hg/xhr/raw-file/default/xhr-1/Overview.html) of `XMLHttpRequest`, we mimick it.

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

[package-url]: https://npmjs.org/package/faux-jax
[npm-version-svg]: http://vb.teelaun.ch/algolia/faux-jax.svg
[travis-svg]: https://img.shields.io/travis/algolia/faux-jax.svg?style=flat-square
[travis-url]: https://travis-ci.org/algolia/faux-jax
[license-image]: http://img.shields.io/npm/l/faux-jax.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/faux-jax.svg?style=flat-square
[downloads-url]: http://npm-stat.com/charts.html?package=faux-jax

