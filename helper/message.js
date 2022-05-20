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
			return new Promise((resolve) => MessageToast.show(this._oBundle.getText(sMessage), {
				onClose: resolve
			}));
		},
		alert(sMessage) {
			return new Promise((resolve) => MessageBox.alert(this._oBundle.getText(sMessage), {
				title: this._oBundle.getText(sMessage + "Title"),
				onClose: resolve
			}));
		},
		die(sMessage) {
			return new Promise((resolve) => MessageBox.error(sMessage, {
				onClose: resolve
			}));
		},
		error(sMessage) {
			return new Promise((resolve) => MessageBox.error(this._oBundle.getText(sMessage), {
				title: this._oBundle.getText(sMessage + "Title"),
				onClose: resolve
			}));
		},
		success(sMessage, aPlaceholders, oOptions) {
			return new Promise((resolve) => MessageBox.success(this._oBundle.getText(sMessage, aPlaceholders), {
				title: this._oBundle.getText(sMessage + "Title"),
				onClose: resolve,
				...oOptions
			}));
		},
		confirm(sMessage) {
			return new Promise((resolve) => MessageBox.confirm(this._oBundle.getText(sMessage), {
				title: this._oBundle.getText(sMessage + "Title"),
				onClose: resolve
			}));
		},
		showHTTPError(oErr) {
			const sDefaultHTTPErrorMessage = "DefaultHTTPErrorMessage";
			var sMessage;
			try {
				// Retrieve GW error detail
				sMessage = JSON.parse(oErr.response.body).error.message.value;
			} catch (e) {
				// else use default error message (undescriptive)
				sMessage = oErr.message;
			}
			return new Promise((resolve) => MessageBox.error(this._oBundle.getText(sDefaultHTTPErrorMessage, sMessage), {
				onClose: resolve
			}));
		}
	};
});
