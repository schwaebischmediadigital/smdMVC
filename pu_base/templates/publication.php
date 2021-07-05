<?php
/**
 * SAMPLE CODE
 * 
 * somewhat like the redFACT /pu_.../publication.php
 *
 * @var $this miniTemplateEngine
 */

// NFY_Frontend_Render replacement
$teInstance = new miniTemplateEngine();

/**
 * just some pseudo tpl vars
 */
$this->tplVars['titleTag'] = "sample page";

$this->tplVars['bodyContent'] = $teInstance->render("sample", "page");
$this->tplVars['footerContent'] = "";