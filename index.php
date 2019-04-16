<?php
/**
 * SAMPLE CODE
 *
 * Somewhat like the /index.php and /pu_.../publication.php to get the MVC to work without redFACT
 */

include dirname(__FILE__) . "/inc/config.php";

// NFY_Frontend_Render replacement
$teInstance = new miniTemplateEngine();

/*
	Both vars are needed for the MVC in the html template, normally you would do something like this in redFACT:

	$this->tplInstance->set('mvcObjectName', $objectClassName);
	$this->tplInstance->set('javascriptObjectName', SZON_Mixed_MvcClassLoader::getScript($objectClassName) . ($cmsLogin ? "?".rand(11111111,99999999) : ""));

	(look at /pu_all/templates/frontendbox.php)
*/
$objectClassName = 'base_page_sample';
$tplVars = [
	'javascriptObjectName' => SZON_Mixed_MvcClassLoader::getScript($objectClassName),
	'objectClassName' => $objectClassName
];

include GLOBAL_FRONTEND_DIR . "pu_base/templates/page/sample.php";