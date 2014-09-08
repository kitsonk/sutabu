define([
], function () {
	'use strict';

	var defineProperty = Object.defineProperty,
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

	function Stub(func) {
		this.func = func;
		this.callstack = [];
	}

	Stub.prototype = {
		func: null,
		callstack: null,
		count: 0,
		reset: function () {
			this.callstack = [];
			this.count = 0;
		},
		invoke: function (scope, args) {
			this.count++;
			var result = this.func.apply(scope, args);
			this.callstack.push({
				scope: scope,
				args: args,
				result: result
			});
			return result;
		},
		remove: function () {
			var oldProperty = this.oldProperty;
			if (oldProperty) {
				if (oldProperty.desc) {
					defineProperty(oldProperty.object, oldProperty.method, oldProperty.desc);
				}
				else {
					delete oldProperty.object[oldProperty.method];
				}
				delete this.oldProperty;
			}
		}
	};

	return {
		func: function (object, method, func) {
			var oldDesc = getDescriptor(object, method),
				stub = new Stub(func),
				desc;

			stub.oldProperty = {
				object: object,
				method: method
			};

			if (!oldDesc) {
				desc = {
					enumerable: true,
					configurable: true
				};
			}
			else {
				stub.oldProperty.desc = oldDesc;
				desc = Object.create(oldDesc);
			}

			desc.value = function () {
				var args = slice.call(arguments, 0);
				return stub.invoke.call(stub, this, args);
			};
			defineProperty(object, method, desc);

			return stub;
		},
		value: function (object, property, value, readOnly) {
			//
		},
		accessor: function (object, property, getter, setter) {
			//
		},
		defineProperty: function (object, property, descriptor) {
			//
		},
		defineProperties: function (object, descriptors) {
			//
		}
	};
});