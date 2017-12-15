sap.ui.define([
	"jquery.sap.global"
], function(
	$
) {
	"use strict";

	/**
	 * i18nProvider simplify usage of ...getModel('i18n').getResourceBundle().getText(...)
	 *
	 * @param {String} msgid - message which has to be translated
	 * @param {Array} args - additional parameters passed to getText
	 *
	 * @return {String} returns translated text from i18n resources
	 *
	 * #Initialization
	 *
	 * You have to initialize module before you want use the i18nProvider during  root Component
	 * initialization. Initialize i18nProvider is dono by calling i18nProvider.initialize method
	 *
	 * Example:
	 *
	 * sap.ui.define([
	 *    "sap/ui/core/UIComponent",
	 *    "path/to/my/lib/i18nProvider"
	 *], function(
	 *    UIComponent,
	 *    i18nProvider
	 *) {
	 *    "use strict";
	 *....
	 *
	 *    return UIComponent.extend("path.to.my.Component", {
	 *
	 *       init: function() {
	 *          i18nProvider.initialize(this.getModel("i18n"));
	 *       }
	 *....
	 *    });
	 *
	 *});
	 *
	 * #Usage
	 *
	 * ## getResourceBundle way
	 *
	 * This way looks like normaly way when you keep jQuery.sap.util.ResourceBundle instance
	 * from i18n model defined in manifest
	 *
	 *sap.ui.define([
	 *    "gs/fin/managepaymentformats/lib/i18nProvider"
	 *], function(
	 *    resourceBundle
	 *) {
	 *    "use strict";
	 *
	 *    ....
	 *
	 *    var TREE_STATUS_TEXTS = {
	 *        "A": {
	 *            version: resourceBundle.getText("ACTIVE"),
	 *            status: resourceBundle.getText("ACTIVE")
	 *        }
	 *    };
	 *
	 *    ....
	 *});
	 *
	 *
	 * ## GNU Gettext way
	 *
	 * This way emulate GNU Gettext way
	 *
	 * sap.ui.define([
	 *    "gs/fin/managepaymentformats/lib/i18nProvider"
	 *], function(
	 *    __
	 *) {
	 *    "use strict";
	 *
	 *....
	 *
	 *    var TREE_STATUS_TEXTS = {
	 *        "A": {
	 *            version: __("ACTIVE"),
	 *            status: __("ACTIVE")
	 *        }
	 *    };
	 *
	 * ....
	 *});
	 *
	 */
	function i18nProvider(msgid, args) {
		return i18nProvider.getText(msgid, args);
	}

	/**
	 * The method shadows jQuery.sap.util.ResourceBundle.getText until
	 * i18n provider is not initialized
	 *
	 * @param {String} msgid - message which has to be translated
	 *
	 * @return {String} returns same string which is passed
	 */
	i18nProvider.getText = function(msgid) {
		$.sap.assert(false, "I18nProvider has been called before initialization.");
		return msgid;
	};


	/**
	 * The method emulate GNU Gettext ngettext function for based on
	 * jQuery.sap.util.ResourceBundle.getText
	 *
	 * @param {String} msgid - message which has to be translated
	 * @param {String} msgidPlural - message which has to be translated in plural form
	 * @param {Number} count - number define which msgid is used
	 *
	 * @return {String} returns same string which is passed
	 */
	i18nProvider.nGetText = function(msgid, msgidPlural, count) {
		var msgStr;
		if (count === 1) {
			msgStr = i18nProvider.getText(msgid, count);
		} else {
			msgStr = i18nProvider.getText(msgidPlural, count);
		}
		return msgStr;
	};

	/**
	 * Initialize i18n provider by instance of sap.ui.model.resource.ResourceModel
	 * The instance is used to call getText method which translates the message
	 * strings
	 *
	 * @param {sap.ui.model.resource.ResourceModel} model - instance of the initialized model
	 */
	i18nProvider.initialize = function(model) {
		i18nProvider.getText = model.getResourceBundle().getText.bind(model.getResourceBundle());
	};

	return i18nProvider;
});