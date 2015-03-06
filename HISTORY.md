# 2.0.0 (2015-03-06)

  * tune XDomainRequest mock. No eventObject for IE8 in event listeners
  * no eventObject in progress events on all browsers when XDomainRequest

# 1.7.1 (2015-03-04)

  * throw when calling `fauxJax.install()` twice
  
# 1.7.0 (2015-03-04)

  * do not allow `.respond()` `.setResponseHeaders()` `.setResponseBody` when request timeout or error

# 1.6.0 (2015-02-26)
  
  * enhance XDomainRequest implem
  * use writable-window-method

# 1.5.1 (2015-02-25)

  * no more modifying the environment before any call to `fauxJax.install()`

# 1.5.0 (2015-02-25)

  * expose support flags through `fauxJax.support`

# 1.4.0 (2015-02-23)

  * do not force a Content-Type if body is null
  * do not force a charset if none set

# 1.3.0 (2015-02-16)
  
  * do not duplicate content-type header if case does not matches
  * setRequestHeader() compare header names in a case insensitive
  * setRequestHeader() appends header values

# 1.2.0 (2015-02-14)
  
  * better progress events
  * more feature detection, closer to native environment

# 1.1.0 (2015-02-13)

  * add IE7/8 compatiblity
  * add more feature detection (events, like onload not on IE7)
  * remove IE6 testing, there will be no compatibility
  * do not use deepEqual from tape on IE7/8, fails

# 1.0.2 (2015-02-12)

  * fix .install() when using XDomainRequest
  * tests ok on IE9
  * ISC => MIT

# 1.0.1 (2015-02-12)

  * [XDomainRequest](https://msdn.microsoft.com/en-us/library/ie/cc288060(v=vs.85).aspx) implementation

# 1.0.0 (2015-02-11)

  * initial

