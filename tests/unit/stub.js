define([
	'intern!object',
	'intern/chai!assert',
	'../../lib/stub'
], function (registerSuite, assert, stub) {
	registerSuite({
		name: 'sutabu/lib/stub',
		'basic': function () {
			var stubCallCount = 0,
				st1 = stub(function (count) {
					stubCallCount++;
					assert.strictEqual(count, stubCallCount);
					return 'foo' + stubCallCount;
				}),
				scope = {};
			
			assert.strictEqual(st1(1), 'foo1');
			assert.strictEqual(stubCallCount, 1);
			assert.strictEqual(st1.callCount, 1);

			assert.strictEqual(st1.call(scope, 2), 'foo2');
			assert.strictEqual(stubCallCount, 2);
			assert.strictEqual(st1.callCount, 2);

			assert.strictEqual(st1.callstack.length, 2);
			assert.isUndefined(st1.callstack[0].scope);
			assert.strictEqual(st1.callstack[0].args.length, 1);
			assert.strictEqual(st1.callstack[0].args[0], 1);
			assert.strictEqual(st1.callstack[0].result, 'foo1');
			assert.strictEqual(st1.callstack[1].scope, scope);
			assert.strictEqual(st1.callstack[1].args.length, 1);
			assert.strictEqual(st1.callstack[1].args[0], 2);
			assert.strictEqual(st1.callstack[1].result, 'foo2');
		},
		'.func()': function () {
			var origCallCount = 0,
				stubCallCount = 0,
				obj = {
					foo: function () {
						origCallCount++;
						return 'foo';
					}
				};

			var handle = stub.func(obj, 'foo', function (count) {
				stubCallCount++;
				assert.strictEqual(count, stubCallCount);
				return 'bar' + stubCallCount;
			});

			assert.strictEqual(obj.foo, handle.stub);
			assert.strictEqual(obj.foo(1), 'bar1');
			assert.strictEqual(stubCallCount, 1);
			assert.strictEqual(obj.foo.callCount, 1);

			assert.strictEqual(obj.foo.call(undefined, 2), 'bar2');
			assert.strictEqual(stubCallCount, 2);
			assert.strictEqual(obj.foo.callCount, 2);
			assert.strictEqual(obj.foo.callstack.length, 2);
			assert.strictEqual(obj.foo.callstack[0].scope, obj);
			assert.strictEqual(obj.foo.callstack[0].args.length, 1);
			assert.strictEqual(obj.foo.callstack[0].args[0], 1);
			assert.strictEqual(obj.foo.callstack[0].result, 'bar1');
			assert.isUndefined(obj.foo.callstack[1].scope);
			assert.strictEqual(obj.foo.callstack[1].args.length, 1);
			assert.strictEqual(obj.foo.callstack[1].args[0], 2);
			assert.strictEqual(obj.foo.callstack[1].result, 'bar2');
		}
	});
});