<?php

/**
 * Class Mvc_Base
 *
 * PHP base class for all MVC classes
 *
 * @author  Matthias Weiß <m.weiss@smdigital.de>
 * @author  Andrew Slane <a.slane@smdigital.de>
 *
 * @version 1.5
 *
 * @changes 201412      MW  :   Initialversion
 *          201501      AS  :   Upload-Erweiterung
 *          20180131    MW  :   Refactoring Upload
 *          20190410    MW  :   Cleanup
 */
abstract class Mvc_Base extends NFY_Mixed_Base
{
	/**
	 * Contains the $moddata array
	 *
	 * @var array
	 */
	protected $moddata = [];

	/**
	 * Contains all valid runtime variable names that can be saved in SZON_Mixed_Registry
	 *
	 * @var array
	 */
	protected $objectDataFields = [];

	/**
	 * Helper array for save() to check which of the $objectDataFields is required
	 *
	 * @var array
	 */
	protected $objectRequiredDataFields = [];

	/**
	 * Contains valid ajax callable functions
	 *
	 * @var array
	 */
	protected $validBackendCalls = ['save', 'validate'];

	/**
	 * For using a data prefix
	 *
	 * @var string
	 */
	protected $objectDataPrefix = '';


	/**
	 * @var SZON_Mixed_Registry|null
	 */
	protected $registryInstance = null;

	/**
	 * Temporary path for uploads
	 *
	 * @var string
	 */
	protected $relativeUploadDirBasePath = 'cms_cache/mvcUploadTmp';

	/**
	 * Generic icon for uploaded files
	 *
	 * @var string
	 */
	protected $relativeUploadBaseFileIcon = '/pu_all/images/dropzone/file.png';

	/**
	 * Deaktiviert.
	 * ['.jpg', '.jpeg', '.png', '.gif'];
	 *
	 * @var array
	 */
	protected $validUploadImagePreviewExtensions = [];

	/**
	 * Mvc_Base constructor.
	 *
	 * @param array $moddata
	 * @throws Exception
	 */
	public function __construct($moddata = [])
	{
		$this->registryInstance = SZON_Mixed_Registry::getInstance();

		$_objectDataPrefix = $this->registryInstance->get("MvcObjectDataPrefix:" . get_class($this));

		if ($_objectDataPrefix) {
			$this->_setObjectDataPrefix($_objectDataPrefix);
		} else {
			$this->_setObjectDataPrefix();
		}

		$this->moddata = $moddata;
	}

	/**
	 * Checks if $function is callable form ajax
	 *
	 * @param $function
	 * @return bool
	 */
	public function isValidBackendFunction($function)
	{
		return in_array($function, $this->validBackendCalls);
	}

	/**
	 * Saves a data prefix if the mvc box is called twice on the same page with different data (wrapper)
	 * For example to make a billing address box and a shipping address box with the same customer data fields
	 *
	 * @param bool $dataPrefix
	 * @throws Exception
	 */
	public function setObjectDataPrefix($dataPrefix = false)
	{
		$this->_setObjectDataPrefix($dataPrefix);
	}

	/**
	 * Saves a data prefix if the mvc box is called twice on the same page with different data
	 * For example to make a billing address box and a shipping address box with the same customer data fields
	 *
	 * @param bool $dataPrefix
	 * @throws Exception
	 */
	private function _setObjectDataPrefix($dataPrefix = false)
	{
		if (!$dataPrefix) {
			$dataPrefix = get_class($this);
		}
		$this->registryInstance->set("MvcObjectDataPrefix:" . get_class($this), $dataPrefix);
		$this->objectDataPrefix = $dataPrefix;
	}

	/**
	 * Returns the set data prefix
	 *
	 * @return string
	 */
	public function getObjectDataPrefix()
	{
		return $this->objectDataPrefix;
	}

	/**
	 * Adds a valid field name to $objectRequiredDataFields on runtime if it is available in $objectDataFields
	 *
	 * @param $name
	 * @throws Exception
	 */
	public function setObjectRequiredDataFields($name)
	{
		if (!is_array($name)) {
			$name = [$name];
		}
		foreach ($name AS $_name) {
			if (in_array($_name, $this->objectDataFields)) {
				$this->objectRequiredDataFields[] = $_name;
			} else {
				throw new Exception(get_class($this) . '::setObjectRequiredDataFields - Fieldname "' . $_name . '" not available.');
			}
		}
	}

	/**
	 * Saves $value on $name in the registry
	 *
	 * @param $name
	 * @param $value
	 * @return bool
	 * @throws Exception
	 */
	protected function setObjectData($name, $value)
	{
		if (in_array($name, $this->objectDataFields)) {
			$this->registryInstance->set($this->objectDataPrefix . ":" . $name, $value);

			return true;
		} else {
			throw new Exception(get_class($this) . '::setObjectData - Fieldname "' . $name . '" not available.');
		}
	}

	/**
	 * Returns the $value of $name
	 * If $name is false / not set it returns all values
	 *
	 * @param bool|string $name
	 * @throws Exception
	 * @return bool|mixed
	 */
	public function getObjectData($name = false)
	{
		$returnValue = null;
		if (!$name) {
			$name = $this->objectDataFields;
		}
		if (is_array($name)) {
			$returnValue = [];
			foreach ($name AS $_name) {
				if (in_array($_name, $this->objectDataFields)) {
					$returnValue[$_name] = $this->registryInstance->get($this->objectDataPrefix . ":" . $_name);
				} else {
					throw new Exception(get_class($this) . '::getObjectData - Fieldname "' . $name . '" not available.');
				}
			}
		} else if (!empty($name)) {
			if (in_array($name, $this->objectDataFields)) {
				$returnValue = $this->registryInstance->get($this->objectDataPrefix . ":" . $name);
			} else {
				throw new Exception(
					get_class($this) . '::getObjectData - Fieldname "' . $name . '" not available. (' . implode(
						', ',
						$this->objectDataFields
					) . ')'
				);
			}
		}

		return $returnValue;
	}

	/**
	 * Checks if all $objectDataFields are valid with validate()
	 *
	 * @return bool
	 * @deprecated
	 * @throws Exception
	 */
	public function isObjectDataValid()
	{
		foreach ($this->objectRequiredDataFields AS $requiredField => $_tmp) {
			$checkValue       = $this->getObjectData($requiredField);
			$validationReturn = $this->validate($requiredField, $checkValue);

			if ($validationReturn != true) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Base functionality to check if a $objectDataFields value is valid ("not empty value")
	 * Should be overwritten in a mvc class
	 *
	 * @param $name
	 * @param $value
	 * @return bool
	 */
	public function validate($name, $value)
	{
		if (!empty($value) AND !empty($name)) {
			return true;
		}

		return false;
	}

	/**
	 * Resets the $objectDataFields
	 *
	 * @throws Exception
	 */
	public function reset()
	{
		foreach ($this->objectDataFields AS $fieldName) {
			$this->setObjectData($fieldName, false);
		}
	}

	/**
	 * $moddata is always read only; just a simple getter
	 *
	 * @return array
	 */
	public function getModdata()
	{
		return $this->moddata;
	}

	/**
	 * Moves a uploaded file to the temporary directory and returns a list of already uploaded files
	 *
	 * @param $uploadedFiles
	 * @param $fieldName
	 * @return array
	 * @throws Exception
	 */
	public function uploadMoveUploadedFileToTempFolder($uploadedFiles, $fieldName)
	{
		$returnValue = [];

		$uploadDirectoryTail = $this->uploadGetRelativeTempDir($fieldName);
		$uploadDirectory     = GLOBAL_FRONTEND_DIR . $uploadDirectoryTail;
		foreach ($uploadedFiles as $fieldname => $file) {
			if (!is_dir($uploadDirectory)) {
				mkdir($uploadDirectory, 0777, true);
			}
			$tempFile = $file['tmp_name'];
			$filename = str_replace(' ', '_', $file['name']);
			$filename = $this->uploadCheckForExistingFile($uploadDirectory, $filename);

			$isMoved    = move_uploaded_file($tempFile, $uploadDirectory . $filename);

			// Prepare some infos to send back for a preview.
			$fileurl = $this->uploadGetRelativeFileIconPath('/' . $uploadDirectoryTail . $filename);

			if ($isMoved) {
				$this->uploadSaveFile($fieldname, $filename, $uploadDirectory);
				$returnValue[] = [
					'filename' => $filename,
					'url'      => $fileurl
				];
			}
		}

		return $returnValue;
	}

	/**
	 * Saves the filenames of uploaded files in a #-seperated list
	 *
	 * @param $fieldName
	 * @param $fileName
	 * @param $uploadDirectory
	 * @throws Exception
	 */
	public function uploadSaveFile($fieldName, $fileName, $uploadDirectory)
	{
		$newFileList = $this->getObjectData($fieldName);
		$newFileList = ((!empty($newFileList)) ? $newFileList . '#' : "") . $uploadDirectory . $fileName;
		$this->setObjectData($fieldName, $newFileList);
	}

	/**
	 * Returns the relative path to the temporary folder
	 *
	 * @param $fieldName
	 * @return string
	 */
	public function uploadGetRelativeTempDir($fieldName)
	{
		return $this->relativeUploadDirBasePath . "/" . session_id() . '/' . $fieldName . "/";
	}

	/**
	 * Returns either $this->relativeUploadBaseFileIcon or if the there is a valid file extension
	 * ($this->validUploadImagePreviewExtensions) is given the file path.
	 * Attention: The file path is on default on cms_cache which is not accessable from outside!
	 *
	 * @param $relativeFilePath
	 * @return string
	 */
	public function uploadGetRelativeFileIconPath($relativeFilePath)
	{
		$fileIcon = $this->relativeUploadBaseFileIcon;
		$needle   = $this->validUploadImagePreviewExtensions;
		if (!empty($needle)) {
			if (!is_array($needle)) $needle = [$needle];
			foreach ($needle as $query) {
				if (strpos($relativeFilePath, $query) !== false) return $relativeFilePath;
			}
		}

		return $fileIcon;
	}

	/**
	 * Deletes a for $fieldName uploaded $fileName from temporary folder.
	 * $fileName must include just the real filename without a path.
	 *
	 * @param $fieldName
	 * @param $fileName
	 * @return bool
	 * @throws Exception
	 */
	public function uploadDeleteFile($fieldName, $fileName)
	{
		$returnData = false;

		$fileList = explode("#", $this->getObjectData($fieldName));
		if (!empty($fileList)) {
			foreach ($fileList AS $_index => $_filePath) {
				if (!empty($_filePath)) {
					$_tmp  = explode("/", $_filePath);
					$_file = array_pop($_tmp);
					if ($_file === $fileName) {
						if (file_exists($_filePath)) {
							unlink($_filePath);
						}
						unset($fileList[$_index]);
					}
				}
			}

			return $this->setObjectData($fieldName, implode("#", $fileList));
		}

		return $returnData;
	}

	/**
	 * A sweet recursive function that makes sure we don't overwrite files that
	 * are uploaded with the same filename. This is important for iOS compatibility.
	 * iOS is dumb and uploads all images with the filename 'image'. Lamesauce.
	 *
	 * @param $directory
	 * @param $testFilename
	 * @return string
	 */
	public function uploadCheckForExistingFile($directory, $testFilename)
	{
		if (file_exists($directory . $testFilename)) {
			$filenamePieces = explode('_', $testFilename);

			if (is_numeric($filenamePieces[0])) {
				$filenamePieces[0] = intval($filenamePieces[0]) + 1;
				$newFilenamePieces = $filenamePieces;
			} else {
				$newFilenamePieces = array_merge([0], $filenamePieces);
			}

			return $this->uploadCheckForExistingFile($directory, implode('_', $newFilenamePieces));
		} else {
			return $testFilename;
		}
	}

	/**
	 * Returns a list of uploaded files with file icons for a preview.
	 *
	 * @param $fieldName
	 * @return array
	 * @throws Exception
	 */
	public function uploadGetUploadedFilesList($fieldName)
	{
		$returnValue = [];

		$fileString = $this->getObjectData($fieldName);
		if (!empty($fileString)) {
			$filesArray = explode("#", $fileString);
			foreach ($filesArray as $fullFilePath) {
				if (!empty($fullFilePath)) {
					// Prepare some infos to send back for a preview.
					$fileurl = $this->uploadGetRelativeFileIconPath('/' . str_replace(GLOBAL_FRONTEND_DIR, "", $fullFilePath));
					$filenamePieces = explode('/', $fullFilePath);
					$filename       = $filenamePieces[count($filenamePieces) - 1]; // The last piece is the filename.

					// Add the preview infos to the array.
					$returnValue[] = [
						'filename' => $filename,
						'url'      => $fileurl
					];
				}
			}
		} else {
			$uploadDirectoryTail = $this->uploadGetRelativeTempDir($fieldName);
			$uploadDirectory     = GLOBAL_FRONTEND_DIR . $uploadDirectoryTail;
			if (is_dir($uploadDirectory)) {
				$files = scandir($uploadDirectory);
				if (!empty($files)) {
					foreach($files AS $file) {
						if (
							$file !== "." AND
							$file !== ".."
						) {
							$this->uploadSaveFile($_POST['fieldName'], $file, $uploadDirectory);
							$fileurl = $this->uploadGetRelativeFileIconPath('/' . $uploadDirectoryTail . $file);
							$returnValue[] = [
								'filename' => $file,
								'url'      => $fileurl
							];
						}
					}
				}
			}
		}

		return $returnValue;
	}
}