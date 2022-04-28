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
		die(sMessage, fCallback) {
			return MessageBox.error(sMessage, {
				onClose: fCallback
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
			return MessageBox.error(this._oBundle.getText(sDefaultHTTPErrorMessage,sMessage));
		}
	};
});
