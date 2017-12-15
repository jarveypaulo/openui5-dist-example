/* eslint-disable sap-no-navigator, sap-no-dom-access */
sap.ui.define([
	"../lib/BaseController",
	"jquery.sap.global",
	"../lib/i18nProvider"
], function(
	BaseController,
	$,
	__
) {
	"use strict";

	var List = BaseController.extend("openui5.example.pages.List");

	List.prototype.versionInfo = function(versionNumber) {
		var retval = {};
		var currentVersionInfo = this.getModel().getProperty("/")
			.map(function (obj, index) {
				return $.extend({}, {index : index}, obj);
			})
			.filter(function(obj){
				return obj.version === versionNumber;
			})
		 if ( currentVersionInfo.length > 0 ) {
			retval = currentVersionInfo[0];
		 }
		return retval;
	};

	List.prototype.statusText = function(versionNumber, beta) {
		var versionInfo = this.versionInfo(versionNumber);
		var text = "";
		if ( versionInfo.beta === "true" ) {
			text= __("TESTING");
		} else if (versionInfo.index === 0) {
			text= __("STABLE");
		} else if (versionInfo.index > 0) {
			text= __("OLDSTABLE");
		}
		return text;
	};

	List.prototype.statusState = function(versionNumber, beta) {
		var versionInfo = this.versionInfo(versionNumber);
		var state = "None";
		if ( versionInfo.beta === "true" ) {
			state= "Warning";
		} else if (versionInfo.index === 0) {
			state= "Success";
		}
		return state;
	}

	List.prototype.handlerListItem = function(event) {
		window.location =  "https://openui5.hana.ondemand.com/#/topic/" + this.getModel().getProperty(event.getSource().getBindingContextPath()).WhatsNewId;
	};

	return List;
});