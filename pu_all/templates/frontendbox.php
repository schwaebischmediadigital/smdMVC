<?php
/**
 * @var $renderInstance NFY_Frontend_Render
 * @var $this NFY_Frontend_Render
 */
$cmsLogin = $this->dataInstance->isEditorialMode();
$renderInstance = $this->getNewRenderInstance('PHPTAL');
$this->setShowInlineButtons(true);
$content = '';
$contentboxInstance = null;

// pu_all objects?
$puCheck = explode("_", $this->moddata['tmplname']);
if ($puCheck[0] == "all") {
	$layoutDir = "pu_all/";
	$mvcClassDir = "pu_all/";
}

// layout files could be in the current $layoutDir and also in pu_all
$layoutDir = GLOBAL_FRONTEND_DIR. (isset($layoutDir) ? $layoutDir : $this->naviInstance->layoutDir);

// the template/tpl can be placed with the name of the template or the name of the module dataset
$tplLogicFileTmplname = $layoutDir . 'templates/' . $this->moddata['dbtable'] . '/' . $this->moddata['tmplname'] . '.php';
$tplLogicFileName = $layoutDir . 'templates/'. $this->moddata['dbtable'] . '/' . $this->moddata['name'].'.php';

$tplFile = $layoutDir .'tpl/' . $this->moddata['dbtable'] . '/'.$this->moddata['name'].'.tpl';
$this->tplFile = (is_file($tplFile) ? $tplFile : ($layoutDir .'tpl/' . $this->moddata['dbtable'] . '/'.$this->moddata['tmplname'].'.tpl'));

// load objects dynamically
$mvcObject = $mvcJavascriptPath = false;
switch($this->moddata['dbtable']) {
	case 'contentbox':
	case 'page':
		$objectClassName = $this->moddata['tmplname'];
		$mvcObject = SZON_Mixed_MvcClassLoader::getClass($this->moddata['tmplname'], $this->moddata);
		$mvcJavascriptPath = SZON_Mixed_MvcClassLoader::getScript($objectClassName);
		break;
}
if ($mvcObject === false) {
	preg_match("/(pu_)([a-zA-Z_]{1,})(\\/)/",(isset($mvcClassDir) ? $mvcClassDir : $this->naviInstance->layoutDir),$match);
	$objectClassName = $match[2]."_".$this->moddata['dbtable']."_".$this->moddata['name'];
	$mvcObject = SZON_Mixed_MvcClassLoader::getClass($objectClassName, $this->moddata);
	if ($mvcJavascriptPath === false) {
		$mvcJavascriptPath = SZON_Mixed_MvcClassLoader::getScript($objectClassName);
	}
}

// module specific mixed module
switch($this->moddata['dbtable']) {
	case 'contentbox':
		$contentboxInstance = SZON_Mixed_Contentbox::getInstance($this->moddata, [
			'NFY_Frontend_Render'       => $renderInstance,
			'NFY_Mixed_Loader'          => $this->dataInstance
		]);
		break;
}

// if we have a mvc object but no frontendbox...
if (is_object($mvcObject) OR $this->moddata['dbtable'] !== "frontendbox") {
	//... load php file:
	if (is_file($tplLogicFileName)) {
		include $tplLogicFileName;
	} else if (is_file($tplLogicFileTmplname)) {
		include $tplLogicFileTmplname;
	}
} else if (!is_object($mvcObject) && (NFY_System_Mode::isQsDomain() || NFY_System_Mode::isDevDomain())) {
	// frontendboxes should always have a $mvcObject
	$this->debug("Fehler: Object ".$objectClassName." konnte nicht initialisiert werden");
}

// standard, mostly depending on mvc, tpl variables
$this->tplInstance->set('mvcObjectName', $objectClassName);
$this->tplInstance->set('javascriptObjectName', $mvcJavascriptPath);
$this->tplInstance->set('class', $this->moddata['dbtable'].' '.$this->moddata['tmplname']);