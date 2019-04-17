<?php
/**
 * SAMPLE CODE
 *
 * @var $this miniTemplateEngine
 * @var $mvcObject base_page_sample
 * 
 * Loads an object from the base_page_sample MVC class
 */
$mvcObject = SZON_Mixed_MvcClassLoader::getClass('base_page_sample', []); // is needed if one wants to work with MVC. See /pu_all/templates/frontendbox.php

/*
    Both vars are needed for the MVC in the html template, normally you would do something like this in redFACT:

	$this->tplInstance->set('mvcObjectName', $objectClassName);
	$this->tplInstance->set('javascriptObjectName', SZON_Mixed_MvcClassLoader::getScript($objectClassName) . ($cmsLogin ? "?".rand(11111111,99999999) : ""));

	(look at /pu_all/templates/frontendbox.php)
 */
$objectClassName = 'base_page_sample';
$this->tplVars = [
	'javascriptObjectName' => SZON_Mixed_MvcClassLoader::getScript($objectClassName),
	'objectClassName' => $objectClassName
];

/**
 * Get's some vars from the base_page_sample class
 */
$this->tplVars['username'] = $mvcObject->getObjectData("username");
$this->tplVars['email'] = $mvcObject->getObjectData("email");