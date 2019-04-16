/**
 * custom styling for return messages
 *
 * @type {{inlineMessageTypes: string, markAsValid: mvc2platformSupport.markAsValid, displayErrorMessage: mvc2platformSupport.displayErrorMessage, displayNoticeMessage: mvc2platformSupport.displayNoticeMessage, displaySuccessMessage: mvc2platformSupport.displaySuccessMessage, resetErrorMessage: mvc2platformSupport.resetErrorMessage, popupMessage: mvc2platformSupport.popupMessage, closePopupMessage: mvc2platformSupport.closePopupMessage, showLoading: mvc2platformSupport.showLoading, hideLoading: mvc2platformSupport.hideLoading}}
 */
var mvc2platformSupport = {
	/**
	 * Marks a field as valid
	 *
	 * @param domObject
	 * @param insertAfterDomObject
	 * @param additionalClass
	 */
	markAsValid: function (domObject, insertAfterDomObject, additionalClass)
	{
		console.log("custom markAsValid called");
	},

	/**
	 * Shows an error
	 *
	 * @param domObject
	 * @param message
	 * @param insertAfterDomObject
	 * @param insertBefore
	 */
	displayErrorMessage: function (domObject, message, insertAfterDomObject, insertBefore)
	{

		console.log("custom displayErrorMessage called");
	},

	/**
	 * Shows an notice message
	 *
	 * @param domObject
	 * @param message
	 * @param insertAfterDomObject
	 * @param insertBefore
	 */
	displayNoticeMessage: function (domObject, message, insertAfterDomObject, insertBefore)
	{
		console.log("custom displayNoticeMessage called");
	},

	/**
	 * Shows an success message
	 *
	 * @param domObject
	 * @param message
	 * @param insertAfterDomObject
	 * @param insertBefore
	 */
	displaySuccessMessage: function (domObject, message, insertAfterDomObject, insertBefore)
	{
		console.log("custom displaySuccessMessage called");
	},

	/**
	 * Resets all messages
	 *
	 * @param domObject
	 * @param insertedAfterDomObject
	 */
	resetErrorMessage: function (domObject, insertedAfterDomObject)
	{
		console.log("custom resetErrorMessage called");
	},

	/**
	 * Opens a popup message
	 *
	 * @param messageObject
	 * @param closeButtonCaption
	 * @param closeButtonAction
	 */
	popupMessage: function (messageObject, closeButtonCaption, closeButtonAction)
	{
		console.log("custom popupMessage called");
	},

	/**
	 * Closes a popup message
	 */
	closePopupMessage: function ()
	{
		console.log("custom closePopupMessage called");
	},

	/**
	 * Opens a loading layer
	 */
	showLoading: function ()
	{
		console.log("custom showLoading called");
	},

	/**
	 * Closes the loading layer
	 */
	hideLoading: function ()
	{
		console.log("custom hideLoading called");
	}
};