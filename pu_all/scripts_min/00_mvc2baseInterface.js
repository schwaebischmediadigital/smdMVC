/**
 * Definition von Standardfunktionen für den MVC2 frontendController
 * Die eigentlichen Funktionen sind größtenteils in der jeweiligen mvc2platformSupport der PU definiert.
 *
 * Es ist nötig jeweils eine mvc2platformSupport zu verwenden um zum Beispiel für die Darstellung von Fehlermeldungen
 * auf verschiedene Styles und Layouts reagieren zu können und von Libraries wie jQuery im Kern des MVC unabhängig zu
 * bleiben
 *
 * @author Matthias Weiß <m.weiss@smdigital.de>
 * @version 2
 * @changes 20150000    MW  - Initialversion
 *          20151013    MW  - updateValue() wurde zu postProcess()
 *          20161012    MW  - popupMessage() hinzugefügt
 *          20161117    MW  - Placement bei Fehler, Hinweis und Erfolgsmeldung sowie callback-Möglichkeit eingefügt
 *          20170600    MW  - inlineMessageTypes als Option hinzugefügt
 *          20180124    MW  - Anpassungen an MVC2
 *
 * @type {{registeredChilden: Array, postProcess: mvc2baseInterface.postProcess, _logError: mvc2baseInterface._logError, isAChild: mvc2baseInterface.isAChild, markAsValid: mvc2baseInterface.markAsValid, displayErrorMessage: mvc2baseInterface.displayErrorMessage, displaySuccessMessage: mvc2baseInterface.displaySuccessMessage, displayNoticeMessage: mvc2baseInterface.displayNoticeMessage, resetErrorMessage: mvc2baseInterface.resetErrorMessage, popupMessage: mvc2baseInterface.popupMessage, showLoading: mvc2baseInterface.showLoading, hideLoading: mvc2baseInterface.hideLoading}}
 */
var mvc2baseInterface = {

	/**
	 * Beinhaltet alle über addListener registrierten Kind-Elemente
	 */
	registeredChilden: [],

	/**
	 * Platzhalter für den Standard-Callback-Funktionsaufruf des frontendControllers
	 *
	 * @param mvcObject
	 * @param childObject
	 * @param postObject
	 * @param returnValue
	 * @param event
	 */
	postProcess: function (mvcObject, childObject, postObject, returnValue, event)
	{
	},

	/**
	 * Abstraktion für console.log
	 *
	 * @param errorMessage
	 * @private
	 */
	_logError: function (errorMessage)
	{
		if (typeof console !== "undefined" || typeof console.smd !== "undefined") {
			console.smd(errorMessage);
		}
	},

	/**
	 * Gibt zurück ob ein Objekt zu einem mvcObjekt gehört.
	 *
	 * @param domObject
	 * @returns {boolean}
	 */
	isAChild: function (domObject)
	{
		return this.registeredChilden.indexOf(domObject) !== -1;
	},

	/**
	 * Wrapper für mvc2platformSupport: Markiert ein Element als valide
	 *
	 * @param fieldID
	 * @param afterOtherObject
	 * @param additionalClass
	 */
	markAsValid: function (fieldID, afterOtherObject, additionalClass)
	{
		if (typeof mvc2platformSupport.markAsValid === "function") {
			mvc2platformSupport.markAsValid(fieldID, afterOtherObject, additionalClass);
		} else {
			this._logError("MVC WARNING: mvc2platformSupport.markAsValid not available");
		}
	},

	/**
	 * Wrapper für mvc2platformSupport: Zeigt eine Fehlermelung an
	 *
	 * @param fieldID
	 * @param message
	 * @param insertAfterFieldId
	 * @param placement
	 * @param callback
	 */
	displayErrorMessage: function (fieldID, message, insertAfterFieldId, placement, callback)
	{
		if (typeof mvc2platformSupport.displayErrorMessage === "function") {
			mvc2platformSupport.displayErrorMessage(fieldID, message, insertAfterFieldId, placement, callback);
		} else {
			this._logError("MVC WARNING: mvc2platformSupport.displayErrorMessage not available");
			alert(message);
		}
	},

	/**
	 * Wrapper für mvc2platformSupport: Zeigt eine Erfolgsmeldung an
	 *
	 * @param fieldID
	 * @param message
	 * @param insertAfterFieldId
	 * @param placement
	 * @param callback
	 */
	displaySuccessMessage: function (fieldID, message, insertAfterFieldId, placement, callback)
	{
		if (typeof mvc2platformSupport.displaySuccessMessage === "function") {
			mvc2platformSupport.displaySuccessMessage(fieldID, message, insertAfterFieldId, placement, callback);
		} else {
			this._logError("MVC WARNING: mvc2platformSupport.displaySuccessMessage not available");
			alert(message);
		}
	},

	/**
	 * Wrapper für mvc2platformSupport: Zeigt eine Hinweismeldung an
	 *
	 * @param fieldID
	 * @param message
	 * @param insertAfterFieldId
	 * @param placement
	 * @param callback
	 */
	displayNoticeMessage: function (fieldID, message, insertAfterFieldId, placement, callback)
	{
		if (typeof mvc2platformSupport.displayNoticeMessage === "function") {
			mvc2platformSupport.displayNoticeMessage(fieldID, message, insertAfterFieldId, placement, callback);
		} else {
			this._logError("MVC WARNING: mvc2platformSupport.displayNoticeMessage not available");
			alert(message);
		}
	},

	/**
	 * Wrapper für mvc2platformSupport: Löscht alle Hinweise zu einem Element
	 *
	 * @param domObject
	 * @param insertedAfterDomObject
	 */
	resetErrorMessage: function (domObject, insertedAfterDomObject)
	{
		if (typeof mvc2platformSupport.resetErrorMessage === "function") {
			mvc2platformSupport.resetErrorMessage(domObject, insertedAfterDomObject);
		} else {
			this._logError("MVC WARNING: mvc2platformSupport.resetErrorMessage not available");
		}
	},

	/**
	 * Wrapper für mvc2platformSupport: Öffnet eine Popup Benachrichtigung
	 *
	 * @param message
	 * @param closeButtonCaption
	 * @param closeButtonAction
	 */
	popupMessage: function (message, closeButtonCaption, closeButtonAction)
	{
		if (typeof mvc2platformSupport.popupMessage === "function") {
			mvc2platformSupport.popupMessage(message, closeButtonCaption, closeButtonAction);
		} else {
			this._logError("MVC WARNING: mvc2platformSupport.popupMessage not available");
			alert(message);
		}
	},

	/**
	 * Wrapper für mvc2platformSupport: Öffnet eine Lade-Layer
	 */
	showLoading: function ()
	{
		if (typeof mvc2platformSupport.showLoading === "function") {
			mvc2platformSupport.showLoading();
		} else {
			this._logError("MVC WARNING: mvc2platformSupport.showLoading not available");
		}
	},

	/**
	 * Wrapper für mvc2platformSupport: Schließt den Lade-Layer
	 */
	hideLoading: function ()
	{
		if (typeof mvc2platformSupport.hideLoading === "function") {
			mvc2platformSupport.hideLoading();
		} else {
			this._logError("MVC WARNING: mvc2platformSupport.showLoading not available");
		}
	}
};