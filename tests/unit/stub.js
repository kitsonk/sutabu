define([
	'intern!object',
	'intern/chai!assert',
	'../../lib/stub'
], function (registerSuite, assert, stub) {
	registerSuite({
		name: 'sutabu/lib/stub',
		'api': function () {
			assert.isFunction(stub.func);
		}
	});
});