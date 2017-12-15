sap.ui.define([
	"sap/ui/base/Object",
	"jquery.sap.storage"
], function(
	Parent,
	$
) {
	"use strict";

	var BaseObject = Parent.extend("openui5.example.BaseObject", {});

	/**
	 * Check persistency key for storage type existency
	 *
	 * @private
	 *
	 * @param {String} persistency - it can be any string but
	 *        returns true only if persistency is one of the
	 *        values in jQuery.sap.storage.Type array
	 *
	 * @return {Boolean} return true if persistency is valid
	 *        storage persistency type
	 */
	function isStoragePersistencyType(persistency) {
		var filteredPersistency = Object.keys($.sap.storage.Type)
			.filter(function(type) {
				return $.sap.storage(type).isSupported();
			})
			.filter(function(type) {
				return persistency === type;
			});

		if (filteredPersistency[0] !== persistency && persistency !== "readonly") {
			throw new Error("Invalid storage type used for \"has\" generator.");
		}
		return !!persistency && filteredPersistency[0] === persistency;
	}

	/**
	 * Returns inital stored value based on default value and
	 * value from storage
	 *
	 * @private
	 *
	 * @param {Any} defaultValue of property if not passed the
	 *        default value is null
	 * @param {Any} storageValue value taken from web storage
	 *
	 * @return {Any}  initial value
	 */
	function initialStoredValue(defaultValue, storageValue) {
		var normalizedDefaultValue = defaultValue === undefined ? null : defaultValue;
		return storageValue === null ? normalizedDefaultValue : storageValue;
	}

	/**
	 * Create getter named getName and setter with setName where
	 * name is property name (passed as first parameter) with first
	 * letter uppercase
	 *
	 * The following lines create different type of getNumber
	 * and setNumber methods
	 *
	 * @code
	 * this.has( "Number", "51136");
	 * this.has( "Number", undefined, $.sap.storage.Type.global);
	 * this.has( "Number", "51136", $.sap.storage.Type.local);
	 * this.has( "Number", "51136", $.sap.storage.Type.session);
	 * this.has( "Number", "51136", "readonly");
	 * @endcode
	 *
	 * @param {String} name - is property name
	 * @param {Any} [defaultValue] of property if not passed the
	 *        default value is null
	 * @param {String} [persistency] - if persistency is "readonly"
	 *        only getter is created. If persistency is key
	 *        from jQuery.sap.storage.Type the setter use
	 *        $.sap.storage get/set value from defined type of
	 *        storage.
	 * @param {String} [prefixKey] - key which is used as prefix for
	 *        keys in web storage. The parameter is used only for
	 *        storages defined in jQuery.sap.storage.Type
	 *
	 * @return {Object} current context for chaining
	 */
	BaseObject.prototype.has = function(name, defaultValue, persistency, prefixKey) {
		var storageInstance;
		var storedValue;
		var storageValue = null;
		var normalizedName;

		//Check parameters existency
		if (arguments.length === 0) {
			throw new Error("Getter name is missing. Getter name is mandatory parameter for \"has\" generator.");
		}

		//Normalize name
		normalizedName = name.charAt(0).toUpperCase() + name.slice(1);

		//Set up persistence storage
		if (isStoragePersistencyType(persistency)) {
			storageInstance = $.sap.storage(persistency, prefixKey);
			storageValue = storageInstance.get(normalizedName);
		}

		storedValue = initialStoredValue(defaultValue, storageValue);

		//Create getter
		this["get" + normalizedName] = function() {
			return storedValue;
		};

		//Create setter
		if (persistency !== "readonly") {
			this["set" + normalizedName] = function(value) {
				//Set value if parameter exists
				if (arguments.length > 0) {
					storedValue = value;
					//Set value to storage for persistency
					if (storageInstance !== undefined) {
						storageInstance.put(normalizedName, storedValue);
					}
				}
				return this;
			}.bind(this);
		}

		return this;
	};

	/**
	 * Creates a new instance of the given class
	 *
	 * @param {Object} TypeConstructor class constructor
	 * @return {Object} instance of the TypeConstructor
	 */
	BaseObject.prototype.new = function(TypeConstructor) {
		return new(Function.prototype.bind.apply(TypeConstructor, arguments))();
	};

	return BaseObject;
});