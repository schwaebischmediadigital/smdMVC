<?php
/**
 * SAMPLE CODE
 *
 * just a _very_ simple template engine; replaces all ${varname}-Variables with content $this->tplVars;
 *
 * $this->tplVars = [
 *	'varname' => 'my value'
 * ];
 *
 * @author  Matthias Weiß <m.weiss@smdigital.de>
 */
class miniTemplateEngine
{
	public $tplVars = [];
	
	public function __construct()
	{
		if (!defined("PUBLICATION")) {
			throw new Exception(get_class() . ' - PUBLICATION not defined');
		}
	}

	private function _loadTemplate($templateName)
	{
		if (!is_file(GLOBAL_FRONTEND_DIR . "pu_" . PUBLICATION . "/tpl/" . $templateName . ".html")) {
			throw new Exception(get_class() . ' - Template not found: "' . GLOBAL_FRONTEND_DIR . "pu_" . PUBLICATION . "/tpl/" . $templateName . ".html" . '"');
		}
		return file_get_contents(GLOBAL_FRONTEND_DIR . "pu_" . PUBLICATION . "/tpl/" . $templateName . ".html");
	}

	public function render($templateName, $type)
	{
		$templatePath = "";
		switch ($type) {
			case 'publication':
				$templatePath = $templateName;
				break;
			default:
				$templatePath = $type . "/" . $templateName;
		}

		if (is_file(GLOBAL_FRONTEND_DIR . "pu_" . PUBLICATION . "/templates/" . $templatePath . ".php")) {
			require_once GLOBAL_FRONTEND_DIR . "pu_" . PUBLICATION . "/templates/" . $templatePath . ".php";
		} 

		$_contentTemplate = $this->_loadTemplate($templatePath);

		if (!empty($this->tplVars)) {
			foreach($this->tplVars AS $tplVarName => $tplVarValue) {
				$_contentTemplate = str_replace('${' . $tplVarName . '}', $tplVarValue, $_contentTemplate);
			}
		}

		return $_contentTemplate;
	}
}