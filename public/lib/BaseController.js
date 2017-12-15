sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"jquery.sap.storage",
	"sap/ui/Global",
	"./BaseObject"
], function(
	Parent,
	$,
	UI,
	BaseObject
) {
	"use strict";

	var BaseController = Parent.extend("openui5.example.lib.BaseController", {});

	BaseController.prototype.has = BaseObject.prototype.has;
	BaseController.prototype.new = BaseObject.prototype.new;

	/**
	 * Convenience method for accessing the event bus.
	 * @public
	 * @returns {sap.ui.core.EventBus} the event bus for this component
	 */
	BaseController.prototype.getEventBus = function() {
		return this.getOwnerComponent().getEventBus();
	};

	/**
	 * Convenience method for accessing the router.
	 * @public
	 * @returns {sap.ui.core.routing.Router} the router for this component
	 */
	BaseController.prototype.getRouter = function() {
		return sap.ui.core.UIComponent.getRouterFor(this);
	};

	/**
	 * Use it instead of getRouter().navTo() if you you want use navBack. It is
	 * use navTo and save the route for future usage in navBack
	 *
	 * @public
	 * @param {String} sName Name of the route
	 * @param {Object}	oParameters?	Parameters for the route
	 * @param {Boolean}	bReplace?	Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
	 */
	BaseController.prototype.navForward = function() {
		var args = Array.prototype.slice.call(arguments);
		var component = this.getOwnerComponent();

		if (!Array.isArray(component.historyStack)) {
			component.historyStack = [];
		}
		component.historyStack.push(args);
		this.getRouter().navTo.apply(this.getRouter(), args);
	};

	/**
	 * Navigate back to the page navigated by the navForward method, if navForward was not
	 * called befaore use default route defined by parameters or do nothing
	 *
	 * @public
	 *
	 * @return {Boolean} true if back navigation is possible
	 */
	BaseController.prototype.canNavBack = function() {
		var component = this.getOwnerComponent();
		return Array.isArray(component.historyStack) && component.historyStack.length > 1;
	};

	/**
	 * Navigate back to the page navigated by the navForward method, if navForward was not
	 * called befaore use default route defined by parameters or do nothing
	 *
	 * @public
	 * @param {String} sName Name of the route
	 * @param {Object}	oParameters?	Parameters for the route
	 * @param {Boolean}	bReplace?	Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
	 *
	 * @return {Boolean} true if navigation was successfully finished
	 */
	BaseController.prototype.navBack = function() {
		var args = Array.prototype.slice.call(arguments);
		var navigated = false;
		var component = this.getOwnerComponent();

		if (this.canNavBack()) {
			component.historyStack.pop();
			this.getRouter().navTo.apply(this.getRouter(), component.historyStack[component.historyStack.length - 1]);
			navigated = true;
		} else if (args.length > 0) {
			component.historyStack = [];
			this.getRouter().navTo.apply(this.getRouter(), args);
			navigated = true;
		}
		return navigated;
	};

	/**
	 * Convenience method for getting the view model by name.
	 * @public
	 * @param {string} [sName] the model name
	 * @returns {sap.ui.model.Model} the model instance
	 */
	BaseController.prototype.getModel = function(sName) {
		return this.getView().getModel(sName);
	};

	/**
	 * Convenience method for setting the view model.
	 * @public
	 * @param {sap.ui.model.Model} oModel the model instance
	 * @param {string} sName the model name
	 * @returns {sap.ui.mvc.View} the view instance
	 */
	BaseController.prototype.setModel = function(oModel, sName) {
		return this.getView().setModel(oModel, sName);
	};

	/**
	 * Gets global UI
	 * @returns {sap.ui.Global} UI
	 */
	BaseController.prototype.getUI = function() {
		return UI;
	};

	/**
	 * Add dependent controls that will be destroyed in onExit event
	 */
	BaseController.prototype.addDependency = function() {
		var controls = Array.prototype.slice.call(arguments);
		var dependencies = this.getDependencies();

		dependencies.push.apply(dependencies, controls);
	};

	/**
	 * Gets all dependencies that will be destroyed in onExit event
	 *
	 * @return {Array} list of dependencies
	 */
	BaseController.prototype.getDependencies = function() {
		if (!this.dependencies) {
			this.dependencies = [];
		}

		return this.dependencies;
	};

	/**
	 * Destructor - calls "destroy" method on each dependent control
	 */
	BaseController.prototype.onExit = function() {
		this.getDependencies().forEach(function(dependent) {
			if (dependent && dependent.destroy) {
				dependent.destroy();
			}
		});
	};

	return BaseController;
});