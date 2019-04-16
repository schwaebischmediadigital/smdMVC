<?php

/**
 * Class SZON_Mixed_MvcBackendController
 *
 * @author  Matthias Weiß <m.weiss@smdigital.de>
 * @version 1.0
 */
class SZON_Mixed_MvcBackendController
{
	/**
	 * Returns a list of valid MVC classes
	 * 
	 * @return array
	 */
	public static function getValidClassesList()
	{
		$returnValue = [];

		$rootDir = scandir(GLOBAL_FRONTEND_DIR);
		foreach($rootDir AS $puName) {
			$puPices = explode("_", $puName);
			if ($puPices[0] === "pu") {
				if (is_dir(GLOBAL_FRONTEND_DIR . $puName . "/classes")) {
					$classesOfAPu = scandir(GLOBAL_FRONTEND_DIR . $puName . "/classes");
					foreach($classesOfAPu AS $classFile) {
						if (strpos($classFile, $puPices[1]) === 0) {
							$returnValue[] = substr($classFile, 0, strlen($classFile) - 4);
						}
					}
				}
			}
		}

		return $returnValue;
	}
	
	/**
	 * Calls a valid backend $function of the $mvcObjectName class with $functionParams
	 * 
	 * @param string $mvcObjectName
	 * @param string $function
	 * @param array  $functionParams
	 * @return mixed|null
	 */
	public static function callValidBackendFunction(string $mvcObjectName, string $function, array $functionParams)
	{
		if (in_array((string)$mvcObjectName, SZON_Mixed_MvcBackendController::getValidClassesList())) {
			$objectInstance = SZON_Mixed_MvcClassLoader::getClass($mvcObjectName);
			if (is_object($objectInstance) AND $objectInstance->isValidBackendFunction($function)) {
				return call_user_func_array([$objectInstance, $function], $functionParams);
			}
		}

		return null;
	}
}