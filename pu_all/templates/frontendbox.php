<?php
/**
 * In pu_base there are no real redFACT-Module PHP files.
 * This is an example of a module base php and can be used as direct include in for example a /pu_.../templates/contentbox.php
 *
 *
 * @var $renderInstance NFY_Frontend_Render
 * @var $this NFY_Frontend_Render
 */
$cmsLogin = $this->dataInstance->isEditorialMode();
$renderInstance = $this->getNewRenderInstance('PHPTAL');
$this->setShowInlineButtons(true);
$content = '';
$contentboxInstance = null;

$puCheck = explode("_", $this->moddata['tmplname']);
if ($puCheck[0] == "all") {
	$layoutDir = "pu_all/";
	$mvcClassDir = "pu_all/";
}

$layoutDir = GLOBAL_FRONTEND_DIR. (isset($layoutDir) ? $layoutDir : $this->naviInstance->layoutDir);

$tplLogicFileTmplname = $layoutDir . 'templates/' . $this->moddata['dbtable'] . '/' . $this->moddata['tmplname'] . '.php';
$tplLogicFileName = $layoutDir . 'templates/'. $this->moddata['dbtable'] . '/' . $this->moddata['name'].'.php';

$tplFile = $layoutDir .'tpl/' . $this->moddata['dbtable'] . '/'.$this->moddata['name'].'.tpl';
$this->tplFile = (is_file($tplFile) ? $tplFile : ($layoutDir .'tpl/' . $this->moddata['dbtable'] . '/'.$this->moddata['tmplname'].'.tpl'));

$mvcObject = false;
switch($this->moddata['dbtable']) {
	case 'contentbox':
		$objectClassName = $this->moddata['tmplname'];
		$mvcObject = SZON_Mixed_MvcClassLoader::getClass($this->moddata['tmplname'], $this->moddata);
		break;
}
if ($mvcObject === false) {
	preg_match("/(pu_)([a-zA-Z_]{1,})(\\/)/",(isset($mvcClassDir) ? $mvcClassDir : $this->naviInstance->layoutDir),$match);
	$objectClassName = $match[2]."_".$this->moddata['dbtable']."_".$this->moddata['name'];

	$mvcObject = SZON_Mixed_MvcClassLoader::getClass($objectClassName, $this->moddata);
}

if (is_object($mvcObject) OR $this->moddata['dbtable'] !== "frontendbox") {
	if (is_file($tplLogicFileName)) {
		include $tplLogicFileName;
	} else if (is_file($tplLogicFileTmplname)) {
		include $tplLogicFileTmplname;
	}
} else if (!is_object($mvcObject) && (NFY_System_Mode::isQsDomain() || NFY_System_Mode::isDevDomain())) {
	$this->debug("ERROR: Object ".$objectClassName." could not be loaded");
}

$this->tplInstance->set('mvcObjectName', $objectClassName);
$this->tplInstance->set('javascriptObjectName', SZON_Mixed_MvcClassLoader::getScript($objectClassName) . ($cmsLogin ? "?".rand(11111111,99999999) : ""));
$this->tplInstance->set('class', $this->moddata['dbtable'].' '.$this->moddata['tmplname']);