/* eslint-disable sap-no-navigator */
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/UIComponent",
	"./lib/i18nProvider"
], function(
	$,
	UIComponent,
	__
) {
	"use strict";

	var Component = UIComponent.extend("openui5.example.Component", {
		"metadata": {
			"manifest": "json"
		}
	});

	Component.prototype.init = function() {
		UIComponent.prototype.init.apply(this, arguments);
		__.initialize(this.getModel("i18n"));
		document.title = __("CURRENT_OPENUI5_RELEASES");
		this.getRouter().initialize();
	};

	return Component;
});