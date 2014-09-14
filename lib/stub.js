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

	function stubFactory(func) {
		var stub = function stub() {
			var args = slice.call(arguments, 0);
			return stub.invoke.call(stub, this, args);
		};

		defineProperties(stub, {
			func: hiddenValueDescriptor(func),
			result: hiddenValueDescriptor(undefined),
			callstack: hiddenValueDescriptor(null),
			callCount: hiddenValueDescriptor(0),
			reset: hiddenValueDescriptor(function () {
				this.callstack = [];
				this.count = 0;
			}),
			invoke: hiddenValueDescriptor(function (scope, args) {
				this.callCount++;
				var result = this.func ? this.func.apply(scope, args) : result;
				this.callstack.push({
					scope: scope,
					args: args,
					result: result
				});
				return result;
			})
		});

		stub.callstack = [];

		return stub;
	}

	defineProperties(stubFactory, {
		func: {
			value: function (object, property, func) {
				if (typeof object !== 'object') {
					throw new TypeError('"object" is not an object');
				}
				if (typeof property !== 'string') {
					throw new TypeError('"property" is not type of string');
				}

				var oldDesc = getDescriptor(object, property),
					stub = stubFactory(func),
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
		}
	});

	return stubFactory;
});