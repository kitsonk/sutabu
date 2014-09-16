# sutabu

[![Build Status](https://travis-ci.org/kitsonk/sutabu.svg?branch=master)](https://travis-ci.org/kitsonk/sutabu)

A minimalist AMD stubbing library for use in testing.

This requires ES5 support.  Therefore IE8 and prior are not supported.

## Usage

The main way to use *sutabu* is to generate stub functions.  Generating a new stub function looks like this:

```javascript
define([ 'sutabu/stub' ], function (stub) {
	var stubFunc = stub();
	var result = stubFunc();

	console.log(stubFunc.callCount); // outputs: 1
});
```

Each generated stub function contains 3 non-emurable properties that dictate how the stub behaves.  If any of these are
set, they will be processed when the function is invoked and returned:

| Property | Description |
|----------| --------------------------------------------------------------------------------------------------------- |
| .throws  | If not undefined, this will be thrown when the stub function is called.                                   |
| .calls   | Assumed to be a function, it will be called with the same scope and arguments as the stub function.       |
| .returns | Whatever is assigned here is returned, which defaults to undefined, which means stub functions return by default `undefined` |

When a new stub function is created, you can pass a single argument that will define how the stub behaves when called.
If you pass an instance of `Error` it will assigned to `.throws`, if you pass a function, it will be assigned to
`.calls` and if you pass any other type of argument, it is assigned to `.returns`.

### Stubbing Functions

If you want to specifically stub a function, you can call `stub.func()`.  Basic usage is something like this:

```javascript
define([ 'sutabu/stub' ], function (stub) {
	var obj = {};

	var handle = stub.func(obj, 'foo', function () {
		return 'bar';
	});

	console.log(obj.foo()); // outputs: 'bar'
	console.log(obj.foo.callCount); // outputs: 1

	handle.remove(); // removes the stub
});
```

## Testing

Testing is done via [The Intern](https://theintern.io) and uses [Grunt](http://gruntjs.com/) for task automation.  To
run the unit tests, first install the prerequisites via [npm](https://www.npmjs.org/):

```bash
npm install
```

To run the unit tests locally, against Node:

```bash
grunt test:node
```

To run the tests using [SauceLabs](https://saucelabs.com/), assuming you have your SauceLabs credentials available in
the environment:

```bash
grunt test
```
