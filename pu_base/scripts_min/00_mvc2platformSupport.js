/**
 * Anpassungen der Standard MVC2 Funktionalitäten an die jeweilige PU
 *
 * @type {{inlineMessageTypes: string, markAsValid: mvc2platformSupport.markAsValid, displayErrorMessage: mvc2platformSupport.displayErrorMessage, displayNoticeMessage: mvc2platformSupport.displayNoticeMessage, displaySuccessMessage: mvc2platformSupport.displaySuccessMessage, resetErrorMessage: mvc2platformSupport.resetErrorMessage, popupMessage: mvc2platformSupport.popupMessage, closePopupMessage: mvc2platformSupport.closePopupMessage, showLoading: mvc2platformSupport.showLoading, hideLoading: mvc2platformSupport.hideLoading}}
 */
var mvc2platformSupport = {

	/**
	 * Positionierung von Inline-Benachrichtigungen.
	 * Je nach wert wird der jeweilige Nachrichtencontainer an verschiedenen stellen im DOM eingefügt.
	 *
	 * Mögliche Werte:
	 * - normal => nach dem Eltenelement
	 * - parent => eine ebene über dem Elternelement
	 * - direct => direkt nach dem Element
	 */
	inlineMessageTypes: 'normal',

	/**
	 * Spielt innerhalb von Schwäbische keine Rolle.
	 *
	 * @param domObject
	 * @param insertAfterDomObject
	 * @param additionalClass
	 */
	markAsValid: function (domObject, insertAfterDomObject, additionalClass)
	{
		/*
		 Es existiert kein Style
		 */
	},

	/**
	 * Zeigt eine Fehlermeldung an
	 *
	 * @param domObject
	 * @param message
	 * @param insertAfterDomObject
	 * @param insertBefore
	 */
	displayErrorMessage: function (domObject, message, insertAfterDomObject, insertBefore)
	{
		if (domObject !== null) {
			mvc2platformSupport.resetErrorMessage(domObject);

			var domObjectToWorkWith = domObject;
			if (domObject.isList) {
				domObjectToWorkWith = domObject.items[0];
			}

			if (typeof insertAfterDomObject === "undefined" || insertAfterDomObject === null) {
				if (this.inlineMessageTypes === "normal") {
					insertAfterDomObject = domObjectToWorkWith.parentNode;
				} else if (this.inlineMessageTypes === "parent") {
					insertAfterDomObject = domObjectToWorkWith.parentNode.parentNode;
				} else {
					insertAfterDomObject = domObjectToWorkWith;
				}
			}

			//dummyfunction... refactoring please...
			if (typeof domObject.forEach !== "function") {
				domObject.forEach = function (callback)
				{
					callback(domObject)
				}
			}

			domObject.forEach(function (_domObjectFromList)
			{
				if (_domObjectFromList.id !== "") {
					var elementLabels = smd.qs("label[for='" + _domObjectFromList.id + "']");
					if (elementLabels !== null) {
						if (elementLabels.isList) {
							elementLabels.forEach(function (elementLabel)
							{
								if (typeof elementLabel === "object" && elementLabel !== null) {
									if (!elementLabel.classList.contains("required-missing")) {
										elementLabel.classList.add("required-missing");
									}
								}
							});
						} else if (!elementLabels.classList.contains("required-missing")) {
							elementLabels.classList.add("required-missing");
						}
					}
				}

				if (!_domObjectFromList.classList.contains("required-missing")) {
					_domObjectFromList.classList.add("required-missing");
				}

				if (smd.qs(".errorMessageBlock[data-for='" + _domObjectFromList.name + "']", insertAfterDomObject.parentNode) === null) {
					if (message !== "") {
						var messageBlock       = document.createElement("DIV");
						messageBlock.className = "errorMessageBlock required-missing";
						messageBlock.setAttribute("data-for", _domObjectFromList.name);
						messageBlock.appendChild(document.createTextNode(message));

						if (insertAfterDomObject !== null) {
							if (insertBefore === true) {
								insertAfterDomObject.parentNode.insertBefore(messageBlock, insertAfterDomObject);
							} else {
								insertAfterDomObject.parentNode.insertBefore(messageBlock, insertAfterDomObject.nextSibling);
							}
							messageBlock.style.display = "block";
						}
					}
				}
			});
		}
	},

	/**
	 * Zeigt eine Information an
	 *
	 * @param domObject
	 * @param message
	 * @param insertAfterDomObject
	 * @param insertBefore
	 */
	displayNoticeMessage: function (domObject, message, insertAfterDomObject, insertBefore)
	{
		if (domObject !== null) {
			mvc2platformSupport.resetErrorMessage(domObject);

			var domObjectToWorkWith = domObject;
			if (domObject.isList) {
				domObjectToWorkWith = domObject.items[0];
			}

			if (typeof insertAfterDomObject === "undefined" || insertAfterDomObject === null) {
				if (this.inlineMessageTypes === "normal") {
					insertAfterDomObject = domObjectToWorkWith.parentNode;
				} else if (this.inlineMessageTypes === "parent") {
					insertAfterDomObject = domObjectToWorkWith.parentNode.parentNode;
				} else {
					insertAfterDomObject = domObjectToWorkWith;
				}
			}

			//dummyfunction... refactoring please...
			if (typeof domObject.forEach !== "function") {
				domObject.forEach = function (callback)
				{
					callback(domObject)
				}
			}

			domObject.forEach(function (_domObjectFromList)
			{
				if (_domObjectFromList.id !== "") {
					var elementLabels = smd.qs("label[for='" + _domObjectFromList.id + "']");
					if (elementLabels !== null) {
						if (elementLabels.isList) {
							elementLabels.forEach(function (elementLabel)
							{
								if (typeof elementLabel === "object" && elementLabel !== null) {
									if (!elementLabel.classList.contains("required-notice")) {
										elementLabel.classList.add("required-notice");
									}
								}
							});
						} else if (!elementLabels.classList.contains("required-notice")) {
							elementLabels.classList.add("required-notice");
						}
					}
				}

				if (!_domObjectFromList.classList.contains("required-notice")) {
					_domObjectFromList.classList.add("required-notice");
				}

				if (smd.qs(".noticeMessageBlock[data-for='" + _domObjectFromList.name + "']", insertAfterDomObject.parentNode) === null) {
					if (message !== "") {
						var messageBlock       = document.createElement("DIV");
						messageBlock.className = "noticeMessageBlock required-notice";
						messageBlock.setAttribute("data-for", _domObjectFromList.name);
						messageBlock.appendChild(document.createTextNode(message));

						if (insertAfterDomObject !== null) {
							if (insertBefore === true) {
								insertAfterDomObject.parentNode.insertBefore(messageBlock, insertAfterDomObject);
							} else {
								insertAfterDomObject.parentNode.insertBefore(messageBlock, insertAfterDomObject.nextSibling);
							}
							messageBlock.style.display = "block";
						}
					}
				}
			});
		}
	},

	/**
	 * Zeigt eine Erfolgsnachricht an.
	 *
	 * @param domObject
	 * @param message
	 * @param insertAfterDomObject
	 * @param insertBefore
	 */
	displaySuccessMessage: function (domObject, message, insertAfterDomObject, insertBefore)
	{

		if (domObject !== null) {
			mvc2platformSupport.resetErrorMessage(domObject);

			var domObjectToWorkWith = domObject;
			if (domObject.isList) {
				domObjectToWorkWith = domObject.items[0];
			}

			if (typeof insertAfterDomObject === "undefined" || insertAfterDomObject === null) {
				if (this.inlineMessageTypes === "normal") {
					insertAfterDomObject = domObjectToWorkWith.parentNode;
				} else if (this.inlineMessageTypes === "parent") {
					insertAfterDomObject = domObjectToWorkWith.parentNode.parentNode;
				} else {
					insertAfterDomObject = domObjectToWorkWith;
				}
			}

			//dummyfunction... refactoring please...
			if (typeof domObject.forEach !== "function") {
				domObject.forEach = function (callback)
				{
					callback(domObject)
				}
			}

			domObject.forEach(function (_domObjectFromList)
			{
				if (_domObjectFromList.id !== "") {
					var elementLabels = smd.qs("label[for='" + _domObjectFromList.id + "']");
					if (elementLabels !== null) {
						if (elementLabels.isList) {
							elementLabels.forEach(function (elementLabel)
							{
								if (typeof elementLabel === "object" && elementLabel !== null) {
									if (!elementLabel.classList.contains("success-notice")) {
										elementLabel.classList.add("success-notice");
									}
								}
							});
						} else if (!elementLabels.classList.contains("success-notice")) {
							elementLabels.classList.add("success-notice");
						}
					}
				}

				if (!_domObjectFromList.classList.contains("success-notice")) {
					_domObjectFromList.classList.add("success-notice");
				}

				if (smd.qs(".successMessageBlock[data-for='" + _domObjectFromList.name + "']", insertAfterDomObject.parentNode) === null) {
					if (message !== "") {
						var messageBlock       = document.createElement("DIV");
						messageBlock.className = "successMessageBlock success-notice";
						messageBlock.setAttribute("data-for", _domObjectFromList.name);
						messageBlock.appendChild(document.createTextNode(message));

						if (insertAfterDomObject !== null) {
							if (insertBefore === true) {
								insertAfterDomObject.parentNode.insertBefore(messageBlock, insertAfterDomObject);
							} else {
								insertAfterDomObject.parentNode.insertBefore(messageBlock, insertAfterDomObject.nextSibling);
							}
							messageBlock.style.display = "block";
						}
					}
				}
			});
		}
	},

	/**
	 * Löscht alle für das domObject angezeigten Meldungen aus dem DOM.
	 *
	 * @param domObject
	 * @param insertedAfterDomObject
	 */
	resetErrorMessage: function (domObject, insertedAfterDomObject)
	{

		if (domObject !== null) {

			var containerToLookForMessageBlock = null;
			if (domObject.isList) {
				containerToLookForMessageBlock = domObject.items[0].parentNode;
			} else {
				containerToLookForMessageBlock = domObject.parentNode;
			}

			if (typeof insertedAfterDomObject === "object") {
				containerToLookForMessageBlock = insertedAfterDomObject;
			}

			if (this.inlineMessageTypes === "normal") {
				containerToLookForMessageBlock = containerToLookForMessageBlock.parentNode;
			} else if (this.inlineMessageTypes === "parent") {
				containerToLookForMessageBlock = containerToLookForMessageBlock.parentNode.parentNode;
			}

			//dummyfunction... refactoring please...
			if (typeof domObject.forEach !== "function") {
				domObject.forEach = function (callback)
				{
					callback(domObject)
				}
			}

			domObject.forEach(function (_domObject)
			{
				_domObject.classList.remove("required-missing");
				_domObject.classList.remove("required-notice");
				_domObject.classList.remove("success-notice");

				if (_domObject.id !== "") {
					var elementLabels = smd.qs("label[for='" + _domObject.id + "']");
					if (elementLabels !== null) {
						if (elementLabels.isList) {
							elementLabels.forEach(function (elementLabel)
							{
								if (typeof elementLabel === "object" && elementLabel !== null) {
									elementLabel.classList.remove("required-missing");
									elementLabel.classList.remove("required-notice");
									elementLabel.classList.remove("success-notice");
								}
							});
						} else {
							elementLabels.classList.remove("required-missing");
							elementLabels.classList.remove("required-notice");
							elementLabels.classList.remove("success-notice");
						}
					}
				}

				var messageBlock = smd.qs("[data-for='" + _domObject.name + "']", containerToLookForMessageBlock);
				if (messageBlock !== null) {
					messageBlock.forEach(function (element)
					{
						if (
							element.classList.contains("errorMessageBlock") ||
							element.classList.contains("noticeMessageBlock") ||
							element.classList.contains("successMessageBlock")
						) {
							containerToLookForMessageBlock.removeChild(element);
						}
					});
				}
			});
		}
	},

	/**
	 * Öffnet eine Popup-Benachrichtigung
	 *
	 * @param messageObject
	 * @param closeButtonCaption
	 * @param closeButtonAction
	 */
	popupMessage: function (messageObject, closeButtonCaption, closeButtonAction)
	{
		smd.ui.popup.open(messageObject);
	},

	/**
	 * Schließt eine Popup-Benachrichtigung
	 */
	closePopupMessage: function ()
	{
		smd.ui.popup.close();
	},

	/**
	 * Zeigt einen Lade-Layer an.
	 */
	showLoading: function ()
	{
		smd.ui.loadingLayer.show();
	},

	/**
	 * Blendet den Lade-Layer aus.
	 */
	hideLoading: function ()
	{
		smd.ui.loadingLayer.hide();
	}
};