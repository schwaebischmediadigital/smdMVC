<?php
/**
 * SAMPLE CODE
 *
 * Somewhat like the redFACT /index.php to get the MVC to work without redFACT
 */

include dirname(__FILE__) . "/inc/config.php";

// NFY_Frontend_Render replacement
$teInstance = new miniTemplateEngine();
echo $teInstance->render("publication", "publication",[]);