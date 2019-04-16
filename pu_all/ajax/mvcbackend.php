<?php
define('SYSINFO', 'FRONTEND');
include('../../inc/config.php');
$returnValue = false;

if (
	!isset($_SERVER['HTTP_REFERER']) OR empty($_SERVER['HTTP_REFERER']) OR
	!isset($domains) OR empty($domains) OR
	!in_array(parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST), array_keys($domains))
) {
	header('HTTP/1.0 403 Forbidden', true, 403);
	die();
}

if (file_exists(GLOBAL_FRONTEND_DIR . "redFACT/customized/resource/frontend/mvcbackend.php")) {
	include_once GLOBAL_FRONTEND_DIR . "redFACT/customized/resource/frontend/mvcbackend.php";
}

if (!empty($_GET) && !empty($_POST)) {
	reset($_GET);
	$ressource = key($_GET);
	switch ($ressource) {
		case 'uploadList':
			if (isset($_POST['class']) && isset($_POST['fieldName'])) {
				$mvcObject = SZON_Mixed_MvcClassLoader::getClass($_POST['class']);
				$returnValue = $mvcObject->uploadGetUploadedFilesList($_POST['fieldName']);
			}
			break;
		case 'uploadFile':
			if (!empty($_FILES) && isset($_POST['class']) && isset($_POST['fieldName'])) {
				$mvcObject = SZON_Mixed_MvcClassLoader::getClass($_POST['class']);
				$returnValue = $mvcObject->uploadMoveUploadedFileToTempFolder($_FILES, $_POST['fieldName']);
			}
			break;
		case 'deleteUploadedFile':
			if (
				!empty($_POST['class']) &&
				isset($_POST['class']) &&
				isset($_POST['fieldName']) &&
				isset($_POST['fileName'])
			) {
				$mvcObject = SZON_Mixed_MvcClassLoader::getClass($_POST['class']);

				$returnValue = [
					'code' => $mvcObject->uploadDeleteFile($_POST['fieldName'], $_POST['fileName'])
				];
			}
			break;
		default:
			if (isset($_POST['objectId'])) {
				$objectId = $_POST['objectId'];
				unset($_POST['objectId']);
				unset($_POST['htmlId']);
				unset($_POST['switcher']);
				$returnValue = SZON_Mixed_MvcBackendController::callValidBackendFunction($objectId, $ressource, $_POST);
			}
	}
}

header('Cache-Control: no-cache, must-revalidate');
header('Content-type: '.NFY_Tools_Mime::CONTENT_TYPE_JSON);
echo json_encode($returnValue);