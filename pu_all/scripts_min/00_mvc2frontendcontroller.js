/**
 * Frontend controller of the SMD MVC
 *
 * @author Matthias Weiß <m.weiss@smdigital.de>
 * @author Andrew Slane <a.slane@smdigital.de>
 *
 * @version 2.0
 *
 * @changes 201511      MW  :   - Misc Bugfixes
 *                              - preFunction
 *                              - event
 *          20151201    MW  :   - Clean-Up
 *                              - Extended addListener.getValueOfElement: data-* functionality
 *          201601      AS  :   - Upload-Extension
 *          20161129    MW  :   - Extended preFunction parameters:
 *                                  Return must be !== (bool) false to call the backend controller
 *                                  (with the return of the function).
 *                              - Upload code cleanup
 *          20180116    MW  :   - Refactoring
 *          20180124    MW  :   - "1.9 - without upload"
 *          20180131    MW  :   - Refactoring upload
 *          20180205    MW  :   - Cleanup
 *          20180920    MW  :   - Extended element lists
 *          20180926    MW  :   - getMvcObjectFromId() and getChildFromMvcObject()
 *          20180927    MW  :   - garbageCollector() for this.mvcObjects
 *          20181022    MW  :   - callBackToObject() is now public
 *          201902      MW  :   - Cleanup
 *                              - Observer fixes
 *          20190315    MW  :   - Automatic listeners with data attribute (data-mvcswitcher)
 *          20190913    MW  :   - Removed CustomEvent
 *
 * @type {{mvcObjects: Array, addListener: mvc2frontendController.addListener, removeListener: mvc2frontendController.removeListener, addObserver: mvc2frontendController.addObserver, removeObserver: mvc2frontendController.removeObserver, callEvent: mvc2frontendController.callEvent, initMvcObject: mvc2frontendController.initMvcObject, queryBackEndController: mvc2frontendController.queryBackEndController, getMvcObjectFromId: mvc2frontendController.getMvcObjectFromId, getChildFromMvcObject: mvc2frontendController.getChildFromMvcObject, _uploadSupport: {init: mvc2frontendController._uploadSupport.init, addFileToPreviewList: mvc2frontendController._uploadSupport.addFileToPreviewList, sendUploadFileViaXHR: mvc2frontendController._uploadSupport.sendUploadFileViaXHR, stopAnEvent: mvc2frontendController._uploadSupport.stopAnEvent}, init: mvc2frontendController.init}}
 */
var mvc2frontendController = {

	/**
	 * List of all registred mvc objects
	 */
	mvcObjects: [],

	/**
	 * MVC message Log
	 */
	_messageLog: [],

	/**
	 * Adds a listener to a dom element
	 *
	 * @param mvcObject         MVC Objekt
	 * @param subObjectSelector CSS celektor child to add a listener to
	 * @param switcher          blur, change, keyup, keydown, input, click, save (click), clickValidate (click with calling the backend controller), upload
	 * @param preFunction       Function that will be executed before the value if the dom node is read and the backend controller is queried
	 *
	 * @returns {*} | null
	 */
	addListener: function (mvcObject, subObjectSelector, switcher, preFunction)
	{
		var domObject = subObjectSelector;
		if (typeof domObject !== "object") {
			domObject = this.getChildFromMvcObject(mvcObject, subObjectSelector);
		}

		/**
		 * if there is more than on dom node found the listener will be bound on all of them
		 */
		if (domObject !== null && typeof domObject.isList !== "undefined" && domObject.isList === true) {
			var returnObjects = [];
			domObject.forEach(function (listElement)
			{
				returnObjects.push(mvc2frontendController.addListener(mvcObject, listElement, switcher, preFunction));
			});
			return returnObjects;
		}

		/**
		 * Returns the vale of a dom node
		 * Multiple selects will be returned as #-separeted string
		 *
		 * @param elements array of DOM-Objects
		 * @returns String | boolean
		 */
		function getValueOfElement(elements)
		{
			for (var _i in elements) {
				if (elements[_i].nodeName === "SELECT") {
					var returnValues = "";
					if ((elements[_i].getAttribute('multiple') !== null) || (elements[_i].getAttribute('multiple') !== '')) {
						for (var i = 0; i < elements[_i].length; i++) {
							if (elements[_i].options[i].selected) {
								if (returnValues === "") {
									returnValues = elements[_i].options[i].value;
								} else {
									returnValues = returnValues + "#" + elements[_i].options[i].value;
								}
							}
						}
						return returnValues;
					}
				} else if (elements[_i].nodeName === "INPUT" && elements[_i].getAttribute('type') === "checkbox") {
					if (elements[_i].checked) {
						return elements[_i].value;
					} else {
						return false;
					}
				} else if (elements[_i].hasAttribute('data-value')) {
					if (
						elements[_i].getAttribute('data-checked') === "checked" ||
						elements[_i].getAttribute('data-selected') === "selected" ||
						(!elements[_i].hasAttribute('data-checked') && !elements[_i].hasAttribute('data-selected'))
					) {
						return elements[_i].getAttribute('data-value');
					} else {
						return false;
					}
				} else if (elements[_i].parentNode.hasAttribute('data-value')) {
					var pElement = elements[_i].parentNode;
					if (
						pElement.getAttribute('data-checked') === "checked" ||
						pElement.getAttribute('data-selected') === "selected" ||
						(!pElement.hasAttribute('data-checked') && !pElement.hasAttribute('data-selected'))
					) {
						return pElement.getAttribute('data-value');
					} else {
						return false;
					}
				}
			}
			return elements[0].value;
		}

		function getNameOfElement(element)
		{
			if (element.hasAttribute('name')) {
				return element.getAttribute('name');
			} else if (element.hasAttribute('data-name')) {
				return element.getAttribute('data-name');
			}

			return null;
		}

		if (typeof domObject === "object" && domObject !== null && typeof mvcObject.postProcess !== "undefined") {

			/**
			 * Dom nodes must have 3 object arrays for adding a mvc2frontendController listener
			 *
			 * postObjects                  contains the values for the listener which will be send to the backend controller
			 * frontendControllerListener   contains the functions of the listeners
			 * frontendControllerObservers  contains all observer objects for this dom node
			 * */
			if (typeof domObject.postObjects !== "object") {
				domObject.postObjects = {};
			}
			if (typeof domObject.frontendControllerListener !== "object") {
				domObject.frontendControllerListener = {};
			}
			if (typeof domObject.frontendControllerObservers === "undefined") {
				domObject.frontendControllerObservers = [];
			}

			//generates an internal id of the dom node
			domObject.mvcObjectRealId = mvcObject.mvcObjectRealId + "-" + function ()
			{
				var str = subObjectSelector;

				if (str.length % 32 > 0) {
					str += Array(33 - str.length % 32).join("z");
				}
				var hash = '', bytes = [], j = 0, k = 0, a = 0, ch = 0,
				    dict                                           = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
				for (var i = 0; i < str.length; i++) {
					ch         = str.charCodeAt(i);
					bytes[j++] = (ch < 127) ? ch & 0xFF : 127;
				}
				var chunk_len = Math.ceil(bytes.length / 32);
				for (i = 0; i < bytes.length; i++) {
					j += bytes[i];
					k++;
					if ((k === chunk_len) || (i === bytes.length - 1)) {
						a = Math.floor(j / k);
						if (a < 32) {
							hash += '0';
						} else if (a > 126) {
							hash += 'z';
						} else {
							hash += dict[Math.floor((a - 32) / 2.76)];
						}
						j = k = 0;
					}
				}
				return hash;
			}();

			/**
			 * Default postObjects object with all relevant contents for a post to the backend
			 *
			 * @type {{objectId: *, switcher: *, name, value: string, preFunctionReturn: boolean}}
			 */
			domObject.postObjects[switcher] = {
				'objectId'         : mvcObject.mvcObjectRealId,
				'switcher'         : switcher,
				'name'             : getNameOfElement(domObject),
				'value'            : '',
				'preFunctionReturn': true
			};

			if (
				switcher === 'blur' ||
				switcher === 'change' ||
				switcher === 'input' ||
				switcher === 'click' ||
				switcher === 'clickValidate' ||
				switcher === 'keyup' ||
				switcher === 'keydown' ||
				switcher === 'save'
			) {
				/**
				 * Builds the function for the listener
				 *
				 * @param event
				 */
				domObject.frontendControllerListener[switcher] = function (event)
				{
					/**
					 * The real listener for the event, which is called after the value is read
					 * and the eventually set preFunction is called.
					 *
					 * @param _defaultFunctionParams
					 */
					var defaultFunction = function (_defaultFunctionParams)
					{
						if (_defaultFunctionParams.postObjects.switcher === "click") {
							mvc2frontendController.callBackToObject(mvcObject, _defaultFunctionParams.mvcObject, _defaultFunctionParams.childObject, _defaultFunctionParams.postObjects, null);
						} else {
							var _backendFunction = 'validate';
							if (_defaultFunctionParams.postObjects.switcher === "save") {
								_backendFunction = 'save';
							}
							mvc2frontendController.queryBackEndController(_backendFunction, _defaultFunctionParams.postObjects, 'POST', function (returnValue)
							{
								mvc2frontendController.callBackToObject(mvcObject, _defaultFunctionParams.mvcObject, _defaultFunctionParams.childObject, _defaultFunctionParams.postObjects, returnValue);
							});
						}
					};

					/**
					 * Calling if the preFunction if set.
					 * If the return is false, the defaultFunction is never called automatically
					 */
					if (typeof preFunction === "function") {
						domObject.postObjects[switcher]['preFunctionReturn'] = preFunction({
							'mvcObject'      : mvcObject,
							'childObject'    : domObject,
							'switcher'       : switcher,
							'event'          : event,
							'postObjects'    : domObject.postObjects[switcher],
							'defaultFunction': defaultFunction
						});
					}

					/**
					 * Reads the value of the dom node
					 */
					if (typeof event.srcElement !== "undefined") {
						domObject.postObjects[switcher].value = getValueOfElement([event.srcElement, domObject]);
					} else if (typeof event.target !== "undefined") {
						domObject.postObjects[switcher].value = getValueOfElement([event.target, domObject]);
					}

					/**
					 * Executes the defaultFUnction
					 */
					if (domObject.postObjects[switcher]['preFunctionReturn'] !== false) {
						defaultFunction({
							'mvcObject'  : mvcObject,
							'childObject': domObject,
							'switcher'   : switcher,
							'event'      : event,
							'postObjects': domObject.postObjects[switcher]
						});
					}
				};

				/**
				 * Bindes the listener to the dom node
				 */
				if (domObject.addEventListener) {
					var _switcher = switcher;
					if (_switcher === "save" || _switcher === "clickValidate") {
						_switcher = "click"
					}

					domObject.addEventListener(_switcher, domObject.frontendControllerListener[switcher], false);
					mvcObject.registeredChilden.push(domObject);

					return domObject;
				}
			} else if (switcher === 'upload') {
				domObject.style.display                        = 'none';
				domObject.frontendControllerListener['change'] = function (event)
				{
					var defaultFunction = function (_defaultFunctionParams)
					{
						// Reset the error message CSS in case one is displayed.
						var divDropzoneError = $s.qs(".mvcDropzone[data-for='" + domObject.mvcObjectRealId + "']", mvcObject);
						divDropzoneError.classList.remove('error');

						// Send each file to the backend one at a time.
						for (var i = 0; i < _defaultFunctionParams.childObject.files.length; i++) {
							mvc2frontendController._uploadSupport.sendUploadFileViaXHR(mvcObject, _defaultFunctionParams.childObject, _defaultFunctionParams.childObject.files[i], _defaultFunctionParams.switcher);
						}
					};

					// Fire a pre-function if one exists.
					if (typeof preFunction === "function") {
						domObject.postObjects[switcher]['preFunctionReturn'] = preFunction({
							'mvcObject'      : mvcObject,
							'childObject'    : domObject,
							'switcher'       : switcher,
							'event'          : event,
							'postObjects'    : domObject.postObjects[switcher],
							'defaultFunction': defaultFunction
						});
					}

					/**
					 * Executres the defaultFunction
					 */
					if (domObject.postObjects[switcher]['preFunctionReturn'] !== false) {
						defaultFunction({
							'mvcObject'  : mvcObject,
							'childObject': domObject,
							'switcher'   : switcher,
							'event'      : event,
							'postObjects': domObject.postObjects[switcher]
						});
					}
				};
				domObject.addEventListener('change', domObject.frontendControllerListener['change'], false);
				mvc2frontendController._uploadSupport.init(mvcObject, domObject, switcher);

				return domObject;
			}
		}

		return null;
	},

	/**
	 * Unbindes a listener
	 *
	 * @param childObject
	 * @param switcher
	 */
	removeListener: function (childObject, switcher)
	{
		if (typeof childObject.frontendControllerListener === "object") {
			var listenerType = switcher;
			if (listenerType === "save") {
				listenerType = "click"
			}
			if (typeof childObject.frontendControllerListener[switcher] === "function") {
				childObject.removeEventListener(listenerType, childObject.frontendControllerListener[switcher]);
			}
		}
	},

	/**
	 * Adds an observer to the observerObject for the observedObject
	 *
	 * @param observedObject
	 * @param observerObject
	 */
	addObserver: function (observedObject, observerObject)
	{
		if (typeof observedObject === "string") {
			observedObject = this.getMvcObjectFromId(observedObject);
		} else if (
			typeof observedObject.mvcClass === "string" &&
			typeof observedObject.mvcChildSelector === "string"
		) {
			var _mvcObject = mvc2frontendController.getMvcObjectFromId(observedObject.mvcClass);
			if (_mvcObject !== null) {
				observedObject = $s.qs(observedObject.mvcChildSelector, _mvcObject);
			} else {
				observedObject = null;
			}
		}
		if (typeof observerObject === "string") {
			observerObject = this.getMvcObjectFromId(observerObject);
		}

		if (observedObject !== null && observerObject !== null) {
			observedObject.forEach(function (_observedObject)
			{
				if (
					typeof _observedObject === "object" &&
					typeof observerObject === "object" &&
					typeof _observedObject.frontendControllerObservers === "object"
				) {
					if (typeof _observedObject.frontendControllerObservers[observerObject] !== "undefined") {
						this.removeObserver(observedObject, observerObject);
					}
					_observedObject.frontendControllerObservers.push(observerObject);
				}
			});
		}
	},

	/**
	 * Deletes an observer on the observedObject
	 *
	 * @param observedObject
	 * @param observerObject
	 */
	removeObserver: function (observedObject, observerObject)
	{
		if (
			typeof observedObject === "object" &&
			typeof observerObject === "object" &&
			typeof observerObject.mvcObjectRealId === "string"
		) {
			var _indexOfObject = null;
			for (var i in observedObject.frontendControllerObservers) {
				if (typeof observedObject.frontendControllerObservers[i].mvcObjectRealId === "string") {
					if (observerObject.mvcObjectRealId === observedObject.frontendControllerObservers[i].mvcObjectRealId) {
						_indexOfObject = i;
						break;
					}
				}
			}

			if (_indexOfObject !== null) {
				observedObject.frontendControllerObservers.splice(
					_indexOfObject,
					1
				);
				return true;
			}
		}
		return false;
	},

	/**
	 * Executes an event of a with addListener added listener on a domObjects manually
	 *
	 * @param domObject
	 * @param switcher
	 */
	callEvent: function (domObject, switcher)
	{
		if (switcher === "clickValidate" || switcher === "save") {
			switcher = "click";
		}
		if (typeof domObject === "object" && document.createEvent) {
			var evt = document.createEvent("Events");
			evt.initEvent(switcher, true, true);
			domObject.dispatchEvent(evt);
		}
	},

	/**
	 * Extends an javascript object with mvcBaseInterface similar to jQuery Extend
	 *
	 * @param object
	 * @returns {*} | null
	 */
	initMvcObject: function (object)
	{
		if (typeof object === "string") {
			object = document.querySelector("[data-mvcid='" + object + "']");
		}
		if (typeof object === "object" && object !== null) {
			object.mvcObjectRealId = object.getAttribute("data-mvcid");
			object.removeAttribute("data-mvcid");
			if (typeof mvc2baseInterface !== "undefined") {
				for (var key in mvc2baseInterface) {
					object[key] = mvc2baseInterface[key];
				}
			}
			this.garbageCollector();
			this.mvcObjects.push(object);

			var _automaticRegisteredFields = object.querySelectorAll("[data-mvcswitcher]");
			if (_automaticRegisteredFields !== null) {
				_automaticRegisteredFields.forEach(function(objectToRegister) {
					mvc2frontendController.addListener(object, objectToRegister, objectToRegister.getAttribute("data-mvcswitcher"));
					objectToRegister.removeAttribute("data-mvcswitcher");
				});
			}

			this.ready(null, object);

			return object;
		}
		return null;
	},

	/**
	 * Executes a ready event if a mvc object has one
	 *
	 * @param callback
	 * @param objectToRunReady
	 */
	ready: function (callback, objectToRunReady)
	{
		if (typeof callback === "function") {
			callback();
		}
		if (typeof objectToRunReady === "object" && typeof objectToRunReady.mvcObjectRealId !== "undefined") {
			var event = new CustomEvent(objectToRunReady.mvcObjectRealId + "::ready");
			document.body.dispatchEvent(event);
			window[objectToRunReady.mvcObjectRealId + "::ready-dispatched"] = true;
		}
	},

	/**
	 * Deletes mvc objects from this.mvcObjects if they aren't in the dom anymore
	 *
	 * @private
	 */
	garbageCollector: function ()
	{
		for (var i in this.mvcObjects) {
			var objectToCheck = this.mvcObjects[i];
			/*
			 * Objekte, die nicht im DOM sind, haben irgendwo in der Hierarchieebene (parentNode.parentNode,...)
			 * ein null. Falls das null erreicht wird ohne dass das aktuelle Element <html> ist, dann ist das
			 * Objekt nicht mehr im DOM.
			 */
			while (objectToCheck.tagName !== "HTML") {
				if (objectToCheck.parentNode === null) {
					this.mvcObjects.splice(i, 1);
					break;
				}
				objectToCheck = objectToCheck.parentNode;
			}
		}
	},

	/**
	 * Queries the backend controller
	 *
	 * @param query
	 * @param data
	 * @param method
	 * @param callback
	 */
	queryBackEndController: function(query, data, method, callback)
	{
		var _callObject = {
			url     : "/pu_all/ajax/mvcbackend.php?" + query,
			callback: callback,
			data    : data,
			method  : method
		};

		if (typeof appAuthToken === "string") {
			_callObject.headers = {
				'APPAUTHTOKEN': appAuthToken
			};
		}

		$s.ajax(_callObject);
	},

	/**
	 * Calls the postProcess function of a _mvcObject and an registered observer mvc object
	 *
	 * @param _givenMvcObject
	 * @param childObject
	 * @param postObject
	 * @param returnValue
	 */
	callBackToObject: function(_mvcObject, _givenMvcObject, childObject, postObject, returnValue)
	{
		_mvcObject.postProcess(_givenMvcObject, childObject, postObject, returnValue);

		if (
			typeof childObject.frontendControllerObservers === "object" &&
			childObject.frontendControllerObservers.length > 0
		) {
			for (var key in childObject.frontendControllerObservers) {
				if (typeof childObject.frontendControllerObservers[key].postProcess === "function") {
					childObject.frontendControllerObservers[key].postProcess(_givenMvcObject, childObject, postObject, returnValue);
				}
			}
		}
	},

	/**
	 * Returns a (or the first) registered mvc object with mvcid
	 *
	 * @param mvcid
	 * @returns {*}
	 */
	getMvcObjectFromId: function(mvcid)
	{
		for (var i in this.mvcObjects) {
			if (this.mvcObjects[i].mvcObjectRealId === mvcid) {
				return this.mvcObjects[i];
			}
		}

		return null;
	},

	/**
	 * Returns a child of a mvcObject on a cssSelector
	 *
	 * @param mvcObject
	 * @param cssSelector
	 * @returns {*}
	 */
	getChildFromMvcObject: function(mvcObject, cssSelector)
	{
		if (typeof mvcObject === "string") {
			mvcObject = this.getMvcObjectFromId(mvcObject);
		}

		if (mvcObject !== null) {
			return $s.qs(cssSelector, mvcObject);
		}

		return null;
	},

	/**
	 * Internal logging functionality
	 *
	 * @param message
	 * @private
	 */
	_logMessage: function(message)
	{
		var d = new Date();
		this._messageLog.push(d.getHours()  + ":" + d.getMinutes() + ":" + d.getSeconds() + " => " + message);
	},

	/**
	 * Subobject for all around the upload functionality
	 */
	_uploadSupport: {

		/**
		 * initialises the upload space, the "drop zone" on a input[type="file"] node
		 *
		 * @param mvcObject
		 * @param domObject
		 * @param switcher
		 */
		init: function (mvcObject, domObject, switcher)
		{
			/*
			 * We'll inject the two divs and a progress bar immediately following the hidden file input.
			 * The first div will be the drop zone for drag-and-drop files and the second div will be the
			 * preview zone. The progress bar will show the progress of file uploads. We'll also request a
			 * list of already uploaded files to show in the preview zone (in case the page was reloaded or
			 * the user navigated away temporarily.)
			 */
			// Make the HTML to inject.
			var htmlToInject = '<div class="mvcDropzone" data-for="' + domObject.mvcObjectRealId + '"></div>'
				+ '<progress class="mvcDropzoneProgress" data-for="' + domObject.mvcObjectRealId + '" min="0" max="100" value="0" style="display:none;">0% complete</progress>'
				+ '<div class="mvcDropzonePreview" data-for="' + domObject.mvcObjectRealId + '"></div>';

			// Inject it and then also inject any previews.
			domObject.insertAdjacentHTML('afterend', htmlToInject);

			// Stick the class name and file input field name into a "form" object.
			var tempFormData = new FormData();
			tempFormData.append("class", domObject.postObjects[switcher].objectId);
			tempFormData.append("fieldName", domObject.name);

			// Send the new form object to the backend, get the uploaded file list, and inject previews for any returned file.
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/pu_all/ajax/mvcbackend.php?uploadList', true);
			xhr.onload = function ()
			{
				/*
				 * IE 10/11 don't support JSON natively as a response type. That means we have to read
				 * the response as plain text and then parse it to a JSON object. Lame sauce...
				 */
				var response = JSON.parse(xhr.responseText);

				// Inject a preview for each uploaded file.
				var divPreviewzone = $s.qs(".mvcDropzonePreview[data-for='" + domObject.mvcObjectRealId + "']", mvcObject);
				for (var j = 0; j < response.length; j++) {
					mvc2frontendController._uploadSupport.addFileToPreviewList(mvcObject, divPreviewzone, domObject.name, response[j].filename, response[j].url);
				}
			};
			xhr.send(tempFormData);

			/*
			 * Lastly we'll add both 'drop' and 'click' listeners to the injected drop zone div. The 'click'
			 * listener will simply propagate the click onto the hidden file input, giving us our fallback
			 * option. The 'drop' listener will send each dropped using XMLHttpRequest().
			 */

			// Add the click listener to the dropzone.
			var divDropzone = $s.qs(".mvcDropzone[data-for='" + domObject.mvcObjectRealId + "']", mvcObject);
			divDropzone.addEventListener('click', function ()
			{
				domObject.click();
			}, false);

			// Add some listeners that change the drop zone's style on drag enter/leave.
			divDropzone.addEventListener('dragenter', function (e)
			{
				mvc2frontendController._uploadSupport.stopAnEvent(e);
				e.target.classList.add('hover');
			}, false);
			divDropzone.addEventListener('dragleave', function (e)
			{
				mvc2frontendController._uploadSupport.stopAnEvent(e);
				e.target.classList.remove('hover');
			}, false);

			// IE...
			divDropzone.addEventListener('dragover', function (e)
			{
				mvc2frontendController._uploadSupport.stopAnEvent(e);
				return false;
			}, false);

			// And lastly make the drop listener.
			divDropzone.addEventListener('drop', function (e)
			{
				// Prevent the browser from just opening the file.
				mvc2frontendController._uploadSupport.stopAnEvent(e);

				// Remove the dragover styling.
				e.target.classList.remove('hover');

				// Get the list of files.
				var fileList = e.dataTransfer.files;

				// Send each file to the backend one at a time.
				for (var k = 0; k < fileList.length; k++) {
					mvc2frontendController._uploadSupport.sendUploadFileViaXHR(mvcObject, domObject, fileList[k], switcher);
				}
			}, false);
		},

		/**
		 * Adds a preview of a already uploaded file
		 *
		 * @param mvcObject
		 * @param previewZone
		 * @param fieldName
		 * @param fileName
		 * @param fileIcon
		 */
		addFileToPreviewList: function (mvcObject, previewZone, fieldName, fileName, fileIcon)
		{
			var previewContainer       = document.createElement("DIV");
			previewContainer.className = "preview";
			previewContainer.setAttribute("data-forFile", fileName);

			var previewFileIcon = document.createElement("IMG");
			previewFileIcon.src = fileIcon;
			previewContainer.appendChild(previewFileIcon);

			var previewFileName       = document.createElement("DIV");
			previewFileName.className = "filename";
			previewFileName.innerText = fileName;

			var previewFileDelete       = document.createElement("SPAN");
			previewFileDelete.className = "icon-trash-empty";
			previewFileDelete.name      = "deleteFile";
			previewFileDelete.setAttribute("data-value", fileName);
			previewFileDelete.innerText = "";

			previewFileDelete.addEventListener("click", function ()
			{
				var tempFormData = new FormData();
				tempFormData.append("class", mvcObject.mvcObjectRealId);
				tempFormData.append("fieldName", fieldName);
				tempFormData.append("fileName", fileName);
				var xhr = new XMLHttpRequest();
				xhr.open('POST', '/pu_all/ajax/mvcbackend.php?deleteUploadedFile', true);
				xhr.onload = function ()
				{
					var fileDeleted = false;
					try {
						var response = JSON.parse(xhr.responseText);

						if (response.code === true) {
							previewContainer.parentNode.removeChild(previewContainer);
							fileDeleted = true;
						}
					} catch (err) { }

					if (!fileDeleted) {
						mvc2platformSupport.popupMessage({
							headline: "Es ist ein Fehler aufgetreten.",
							message : "Die Datei konnte nicht gelöscht werden. Bitte wenden Sie sich an unseren Support."
						});
					}
				};
				xhr.send(tempFormData);
			});

			previewFileName.appendChild(previewFileDelete);
			previewContainer.appendChild(previewFileName);

			previewZone.appendChild(previewContainer);
		},

		/**
		 * Used with the new drag-and-drop listener. Sends a 'file' dragged and dropped
		 * onto the 'node' with a switcher oftype 'eventType' to the MVC backend using
		 * an XMLHttpRequest() call.
		 *
		 * @param mvcObject
		 * @param domObject
		 * @param file
		 * @param eventType
		 */
		sendUploadFileViaXHR: function (mvcObject, domObject, file, eventType)
		{
			// Stick the file into a "form" object.
			var tempFormData = new FormData();
			tempFormData.append("class", domObject.postObjects[eventType].objectId);
			tempFormData.append("fieldName", domObject.name);
			tempFormData.append(domObject.name, file);

			// Fetch the progress bar and show it.
			var progressbar           = $s.qs(".mvcDropzoneProgress[data-for='" + domObject.mvcObjectRealId + "']", mvcObject);
			progressbar.style.display = 'block';

			// Send the form object to the backend.
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/pu_all/ajax/mvcbackend.php?uploadFile', true);
			xhr.upload.onprogress = function (e)
			{
				if (e.lengthComputable) {
					progressbar.value       = (e.loaded / e.total) * 100;
					progressbar.textContent = progressbar.value + '%';
				}
			};
			xhr.onerror           = function ()
			{
				var divDropzone = $s.qs(".mvcDropzone[data-for='" + domObject.mvcObjectRealId + "']", mvcObject);
				divDropzone.classList.add('error');
				mvc2platformSupport.popupMessage({
					headline: "Es ist ein Fehler aufgetreten.",
					message : "Die Datei konnte nicht hochgeladen werden. Bitte wenden Sie sich an unseren Support."
				});
			};
			xhr.onload            = function ()
			{
				var fileUploaded = false;

				try {
					/*
					 * IE 10/11 don't support JSON natively as a response type. That means we have to read
					 * the response as plain text and then parse it to a JSON object. Lame sauce...
					 */
					var response = JSON.parse(xhr.responseText);

					// Show a preview for each uploaded file.
					var divPreviewzone = $s.qs(".mvcDropzonePreview[data-for='" + domObject.mvcObjectRealId + "']", mvcObject);
					for (var j = 0; j < response.length; j++) {
						mvc2frontendController._uploadSupport.addFileToPreviewList(mvcObject, divPreviewzone, domObject.name, response[j].filename, response[j].url);
					}
					fileUploaded = true;
				} catch (err) { }

				if (!fileUploaded) {
					mvc2platformSupport.popupMessage({
						headline: "Es ist ein Fehler aufgetreten.",
						message : "Die Datei konnte nicht hochgeladen werden. Bitte wenden Sie sich an unseren Support."
					});
				}
			};
			xhr.addEventListener('loadend', function ()
			{
				// Fires after load, error, and abort.
				// Reset and hide the progress bar.
				progressbar.value         = 0;
				progressbar.style.display = 'none';
			});
			xhr.send(tempFormData);
		},

		/**
		 * Used with the new drag-and-drop listener. Stops event bubbling and also
		 * prevents the browser from doing it's usual thing.
		 *
		 * @param event
		 */
		stopAnEvent: function (event)
		{
			event.preventDefault();
			event.stopPropagation();
		}
	}
};