define([
	'intern!object',
	'intern/chai!assert',
	'../../lib/stub'
], function (registerSuite, assert, stub) {
	registerSuite({
		name: 'sutabu/lib/stub',
		'api': function () {
			assert.typeOf(stub, 'function');
			assert.typeOf(stub.func, 'function');
			assert.typeOf(stub.Stub, 'function');
		},
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
			/* works inconsistently across different browsers */
			// assert.isUndefined(st1.lastCall.scope);
			assert.strictEqual(st1.lastCall.args.length, 1);
			assert.strictEqual(st1.lastCall.args[0], 1);
			assert.strictEqual(st1.lastCall.result, 'foo1');

			assert.strictEqual(st1.call(scope, 2), 'foo2');
			assert.strictEqual(stubCallCount, 2);
			assert.strictEqual(st1.callCount, 2);

			assert.strictEqual(st1.callStack.length, 2);
			assert.isUndefined(st1.callStack[0].scope);
			assert.strictEqual(st1.callStack[0].args.length, 1);
			assert.strictEqual(st1.callStack[0].args[0], 1);
			assert.strictEqual(st1.callStack[0].result, 'foo1');
			assert.strictEqual(st1.callStack[1].scope, scope);
			assert.strictEqual(st1.callStack[1].args.length, 1);
			assert.strictEqual(st1.callStack[1].args[0], 2);
			assert.strictEqual(st1.callStack[1].result, 'foo2');
			assert.strictEqual(st1.lastCall.scope, scope);
			assert.strictEqual(st1.lastCall.args.length, 1);
			assert.strictEqual(st1.lastCall.args[0], 2);
			assert.strictEqual(st1.lastCall.result, 'foo2');
		},
		'throwing': function () {
			var st1 = stub(new Error('I am an error'));

			assert.throws(function () {
				st1();
			}, Error);

			var st2 = stub();
			assert.isUndefined(st2());
			st2.throws = new Error('I am an error');
			assert.throws(function () {
				st2();
			}, Error);
			console.log(st2.callStack);
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
			assert.strictEqual(obj.foo.callStack.length, 2);
			assert.strictEqual(obj.foo.callStack[0].scope, obj);
			assert.strictEqual(obj.foo.callStack[0].args.length, 1);
			assert.strictEqual(obj.foo.callStack[0].args[0], 1);
			assert.strictEqual(obj.foo.callStack[0].result, 'bar1');
			assert.isUndefined(obj.foo.callStack[1].scope);
			assert.strictEqual(obj.foo.callStack[1].args.length, 1);
			assert.strictEqual(obj.foo.callStack[1].args[0], 2);
			assert.strictEqual(obj.foo.callStack[1].result, 'bar2');
		}
	});
});