define([
], function () {
	'use strict';

	var defineProperty = Object.defineProperty,
		defineProperties = Object.defineProperties,
		getPrototypeOf = Object.getPrototypeOf,
		getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
		hasOwnProp = Object.prototype.hasOwnProperty;
	
	var slice = Array.prototype.slice;

	function getDescriptor(obj, name) {
		while (obj && !hasOwnProp.call(obj, name)) {
			obj = getPrototypeOf(obj);
		}
		return obj ? getOwnPropertyDescriptor(obj, name) : undefined;
	}

	function hiddenValueDescriptor(value) {
		return {
			value: value,
			writable: true,
			configurable: true
		};
	}

	function mixin(dest, source) {
		var name, value, empty = {};
		for (name in source) {
			value = source[name];
			if (!(name in dest) || (dest[name] !== value && (!(name in empty) || empty[name] !== value))) {
				defineProperty(dest, name, getDescriptor(source, name));
			}
		}
	}

	function Stub(options) {
		var returns;
		if ('returns' in options) {
			returns = options.returns;
			delete options.returns;
		}
		if (options) {
			mixin(this, options);
		}
		if (returns) {
			this.returns = returns;
		}
		this.callStack = [];
	}

	var stubPrototypeProperties = {
		calls: hiddenValueDescriptor(undefined),
		returns: hiddenValueDescriptor(undefined),
		throws: hiddenValueDescriptor(undefined),
		lastCall: hiddenValueDescriptor(undefined),
		callStack: hiddenValueDescriptor(null),
		callCount: hiddenValueDescriptor(0),
		reset: hiddenValueDescriptor(function () {
			this.callStack = [];
			this.callCount = 0;
			this.lastCall = undefined;
		}),
		invoke: hiddenValueDescriptor(function (scope, args) {
			this.callCount++;
			var result, didThrow;
			try {
				result = this.throws || (this.calls ? this.calls.apply(scope, args) : this.returns);
			} catch (e) {
				didThrow = true;
				result = e;
			}
			this.lastCall = {
				scope: scope,
				args: args,
				result: result
			};
			this.callStack.push(this.lastCall);
			if (this.throws || didThrow) {
				throw result;
			}
			return result;
		})
	};

	defineProperties(Stub.prototype, stubPrototypeProperties);

	function stubFactory(returns) {
		var stub = function stub() {
			var args = slice.call(arguments, 0);
			return stub.invoke.call(stub, this, args);
		};

		defineProperties(stub, stubPrototypeProperties);

		if (returns instanceof Error) {
			stub.throws = returns;
		}
		else if (typeof returns === 'function') {
			stub.calls = returns;
		}
		else {
			stub.returns = returns;
		}
		stub.callStack = [];

		return stub;
	}

	defineProperties(stubFactory, {
		func: {
			value: function (object, property, returns) {
				if (typeof object !== 'object') {
					throw new TypeError('"object" is not an object');
				}
				if (typeof property !== 'string') {
					throw new TypeError('"property" is not type of string');
				}

				var oldDesc = getDescriptor(object, property),
					stub = stubFactory(returns),
					desc;
	
				if (!oldDesc) {
					desc = {
						writable: true,
						enumerable: true,
						configurable: true
					};
				}
				else {
					if (!('value' in oldDesc)) {
						throw new TypeError('Target property "' + property + '" is not a value property.');
					}
					if (!(oldDesc.configurable)) {
						throw new TypeError('Target property "' + property + '" is not configurable.');
					}
					desc = Object.create(oldDesc);
				}
	
				desc.value = stub;
				defineProperty(object, property, desc);
	
				return {
					remove: function () {
						if (oldDesc) {
							defineProperty(object, property, desc);
						}
						else {
							delete object[property];
						}
					},
					stub: stub
				};
			},
			enumerable: true
		},
		Stub: {
			value: Stub,
			enumerable: true
		}
	});

	return stubFactory;
});