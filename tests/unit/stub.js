define([
	'intern!object',
	'intern/chai!assert',
	'../../lib/stub'
], function (registerSuite, assert, stub) {
	registerSuite({
		name: 'sutabu/lib/stub',
		'api': function () {
			assert.isFunction(stub.func);
			assert.isFunction(stub.value);
			assert.isFunction(stub.accessor);
			assert.isFunction(stub.defineProperty);
			assert.isFunction(stub.defineProperties);
		},
		'stub function': function () {
			var origcall = 0,
				call = 0,
				obj = {
					foo: function (count) {
						assert.strictEqual(count, 3);
						origcall++;
						return 'bar';
					}
				};

			var s1 = stub.func(obj, 'foo', function (count) {
				assert.strictEqual(count, s1.count);
				assert.strictEqual(this, obj);
				call++;
				return 'foo';
			});

			assert.strictEqual(obj.foo(1), 'foo');
			assert.strictEqual(call, 1);
			assert.strictEqual(origcall, 0);
			assert.strictEqual(s1.count, 1);

			assert.strictEqual(obj.foo(2), 'foo');
			assert.strictEqual(call, 2);
			assert.strictEqual(origcall, 0);
			assert.strictEqual(s1.count, 2);

			assert.strictEqual(s1.callstack.length, 2);
			assert.strictEqual(s1.callstack[0].scope, obj);
			assert.strictEqual(s1.callstack[0].args.length, 1);
			assert.strictEqual(s1.callstack[0].args[0], 1);
			assert.strictEqual(s1.callstack[0].result, 'foo');
			assert.strictEqual(s1.callstack[1].scope, obj);
			assert.strictEqual(s1.callstack[1].args.length, 1);
			assert.strictEqual(s1.callstack[1].args[0], 2);
			assert.strictEqual(s1.callstack[1].result, 'foo');

			s1.remove();
			assert.strictEqual(obj.foo(3), 'bar');
			assert.strictEqual(origcall, 1);
		}
	});
});