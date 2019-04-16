<?php

/**
 * Class SZON_Mixed_MvcClassLoader
 *
 * @author Matthias Weiß <m.weiss@smdigital.de>
 * @version 2
 * @changes 20180920    MW  :   - $moddata in getClass()
 * @changes 20190510    MW  :   - Cleanup
 */
class SZON_Mixed_MvcClassLoader
{
	/**
	 * Returns an object of $objectClassName
	 * $moddata is optional
	 * 
	 * @param       $objectClassName
	 * @param array $moddata (optional)
	 * @return bool|object
	 */
	public static function getClass($objectClassName, $moddata = [])
	{
		require_once dirname(__FILE__) . '/mvcClasses/mvc_base.php';
		$objectMeta = explode("_", $objectClassName);
		$scriptName = "pu_" . strtolower($objectMeta[0]) . "/classes/" . strtolower($objectClassName) . '.php';
		if (file_exists(GLOBAL_FRONTEND_DIR . $scriptName)) {
			require_once GLOBAL_FRONTEND_DIR . $scriptName;
			if (class_exists($objectClassName, false)) {
				if (!empty($moddata)) {
					return new $objectClassName($moddata);
				} else {
					return new $objectClassName;
				}
			}
		}

		return false;
	}

	/**
	 * Returns the filename and path of a $objectClassName for a <script>-Tag
	 * 
	 * @param $objectClassName
	 * @return bool|string
	 */
	public static function getScript($objectClassName)
	{
		$objectMeta = explode("_", $objectClassName);
		$scriptName = "pu_" . strtolower($objectMeta[0]) . "/scripts/" . strtolower($objectClassName) . ".js";
		if (file_exists(GLOBAL_FRONTEND_DIR . $scriptName)) {
			return "/" . $scriptName;
		}

		return false;
	}
}