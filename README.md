# sutabu

[![Build Status](https://travis-ci.org/kitsonk/sutabu.svg?branch=master)](https://travis-ci.org/kitsonk/sutabu)

A minimalist AMD stubbing library for use in testing.

This requires ES5 support.  Therefore IE8 and prior are not supported.

## Testing

Testing is done via [The Intern][https://theintern.io] and uses [Grunt][http://gruntjs.com/] for task automation.  To
run the unit tests, first install the prerequisites via [npm][https://www.npmjs.org/]:

```bash
npm install
```

To run the unit tests locally, against Node:

```bash
grunt test:node
```

To run the tests using [SauceLabs][https://saucelabs.com/], assuming you have your SauceLabs credentials available in
the environment:

```bash
grunt test
```
