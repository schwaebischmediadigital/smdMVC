<?php
/**
 * SAMPLE CODE
 *
 * pseudo config.php:
 *
 * - loads the miniTemplateEngine, since PHPTAL and redFACT isn't there
 * - loads the mixed classes for the MVC, since there is no redFACT
 * - sets all needed vars
 */

// (more or less) default redFACT vars:
define('GLOBAL_FRONTEND_DIR', realpath(dirname(__FILE__) . "/..") . "/");
$domains = ['localhost'];

// since there is no redFACT we must specify the publication for the template engine:
define('PUBLICATION', "base");

// class loader:
require_once GLOBAL_FRONTEND_DIR . 'inc/classes/miniTemplateEngine.php';
require_once GLOBAL_FRONTEND_DIR . 'inc/classes/nfy_dummy_classes.php';
require_once GLOBAL_FRONTEND_DIR . 'redFACT/customized/classes/mixed/szon_mixed_mvcbackendcontroller.php';
require_once GLOBAL_FRONTEND_DIR . 'redFACT/customized/classes/mixed/szon_mixed_mvcclassloader.php';
require_once GLOBAL_FRONTEND_DIR . 'redFACT/customized/classes/mixed/szon_mixed_registry.php';