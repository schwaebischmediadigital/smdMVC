<?php
/**
 * SAMPLE CODE
 *
 * just a _very_ simple template engine; replaces all ${varname}-Variables with content in render/$tplVars;
 *
 * $tplVars = [
 *	'varname' => 'my value'
 * ];
 *
 * @author  Matthias Weiß <m.weiss@smdigital.de>
 */
class miniTemplateEngine
{
	private $_publicationTemplate = "";

	public function __construct()
	{
		if (!defined("PUBLICATION")) {
			throw new Exception(get_class() . ' - PUBLICATION not defined');
		}

		$this->_publicationTemplate = $this->_loadTemplate("base");
	}

	private function _loadTemplate($templateName)
	{
		if (!is_file(GLOBAL_FRONTEND_DIR . "pu_" . PUBLICATION . "/tpl/" . $templateName . ".html")) {
			throw new Exception(get_class() . ' - Template not found: "' . GLOBAL_FRONTEND_DIR . "pu_" . PUBLICATION . "/tpl/" . $templateName . ".html" . '"');
		}
		return file_get_contents(GLOBAL_FRONTEND_DIR . "pu_" . PUBLICATION . "/tpl/" . $templateName . ".html");
	}

	public function render($templateName, $type, $tplVars)
	{
		$_contentTemplate = str_replace('${bodyContent}', $this->_loadTemplate($type . "/" . $templateName), $this->_publicationTemplate);

		if (!empty($tplVars)) {
			foreach($tplVars AS $tplVarName => $tplVarValue) {
				$_contentTemplate = str_replace('${' . $tplVarName . '}', $tplVarValue, $_contentTemplate);
			}
		}

		echo $_contentTemplate;
	}
}