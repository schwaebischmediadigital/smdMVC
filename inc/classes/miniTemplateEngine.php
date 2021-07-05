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
		$_templatePath = "";
		switch ($type) {
			case 'publication':
				$_templatePath = $templateName;
				break;
			default:
				$_templatePath = $type . "/" . $templateName;
		}

		if (is_file(GLOBAL_FRONTEND_DIR . "pu_" . PUBLICATION . "/templates/" . $_templatePath . ".php")) {
			require_once GLOBAL_FRONTEND_DIR . "pu_" . PUBLICATION . "/templates/" . $_templatePath . ".php";
		} 

		$_contentTemplate = $this->_loadTemplate($_templatePath);

		if (!empty($this->tplVars)) {
			foreach($this->tplVars AS $_tplVarName => $_tplVarValue) {
				$_contentTemplate = str_replace('${' . $_tplVarName . '}', $_tplVarValue, $_contentTemplate);
			}
		}

		return $_contentTemplate;
	}
}