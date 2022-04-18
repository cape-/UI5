// Initialize in controler as follows:
//   message.setI18nModel(this.getOwnerComponent().getModel("i18n"));
sap.ui.define([
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (MessageBox, MessageToast) {
	"use strict";
	return {
		setI18nModel(oModel) {
			this._i18nModel = oModel;
			this._oBundle = oModel.getResourceBundle();
		},
		toast(sMessage) {
			return MessageToast.show(this._oBundle.getText(sMessage));
		},
		alert(sMessage) {
			return MessageBox.alert(this._oBundle.getText(sMessage), {
				title: this._oBundle.getText(sMessage + "Title")
			});
		},
		error(sMessage) {
			return MessageBox.error(this._oBundle.getText(sMessage), {
				title: this._oBundle.getText(sMessage + "Title")
			});
		},
		confirm(sMessage, fCallback) {
			return MessageBox.confirm(this._oBundle.getText(sMessage), {
				title: this._oBundle.getText(sMessage + "Title"),
				onClose: fCallback
			});
		}
	};
});
