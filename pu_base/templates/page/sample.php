<?php
/**
 * SAMPLE CODE
 *
 * Works like a /pu_.../templates/.../sample.php
 */

/**
 * just some pseudo tpl vars
 */
$tplVars['titleTag'] = "sample page";

/**
 * @var $mvcObject base_page_sample
 */
$mvcObject = SZON_Mixed_MvcClassLoader::getClass('base_page_sample', []); // is needed if one wants to work with MVC. See /pu_all/templates/frontendbox.php

/**
 * Get's some vars from the base_page_sample class
 */
$tplVars['username'] = $mvcObject->getObjectData("username");
$tplVars['email'] = $mvcObject->getObjectData("email");

/**
 * @var $teInstance miniTemplateEngine
 */
$teInstance->render("sample", "page", $tplVars);