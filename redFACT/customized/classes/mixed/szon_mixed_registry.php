<?php

/**
 * Class SZON_Mixed_Registry
 *
 * Wrapper-Class / Registry Pattern Implementation
 *
 * @author  Matthias Weiß <m.weiss@smdigital.de>
 * @version 1.0
 */
class SZON_Mixed_Registry extends NFY_Mixed_Base
{
	/**
	 * @var null | SZON_Mixed_Registry
	 */
	private static $instance     = null;

	/**
	 * Array with data for the "self" data provider
	 *
	 * @var array
	 */
	private        $cachedData   = [];

	/**
	 * @var string
	 */
	private        $dataProvider = "";

	/**
	 * Returns an Instance of SZON_Mixed_Registry
	 *
	 * possible data providers:
	 * - "session" uses a PHP Session with NFY_Session_Base if available
	 * - "mixedCache" uses NFY_Mixed_Cache if redFACT is there
	 * - "self" uses a static array
	 *
	 * @param string $dataProvider
	 * @return SZON_Mixed_Registry|null
	 * @throws Exception
	 */
	public static function getInstance($dataProvider = "session")
	{
		if (self::$instance === null) {
			self::$instance = new SZON_Mixed_Registry($dataProvider);
		}

		return self::$instance;
	}

	/**
	 * SZON_Mixed_Registry constructor.
	 *
	 * @param $dataProvider
	 * @throws Exception
	 */
	private function __construct($dataProvider)
	{
		$this->dataProvider = $dataProvider;

		switch ($this->dataProvider) {
			case 'session':
				if (class_exists("NFY_Session_Base")) {
					if (NFY_Session_Base::isStarted() === false) {
						/*
						 *  Achtung: NFY_System_Mode::isDev() funktioniert auf dem SSO nicht!
						 */
						$sessionName = "rfFUS" . (NFY_System_Mode::isDevDomain() ? '_DEV' : '');
						NFY_Session_Base::setName($sessionName);
						NFY_Session_Base::start();
					}
				} else if (session_status() === PHP_SESSION_NONE) {
					session_start();
				}

				break;

			case 'mixedCache':
				if (!class_exists("NFY_Mixed_Cache")) {
					throw new Exception(get_class() . ' - NFY_Mixed_Cache not defined.');
				}
		}
	}

	/**
	 * Saves a $value for a $key
	 *
	 * @param $key
	 * @param $value
	 * @throws Exception
	 */
	public function set($key, $value)
	{
		$md5key = md5($key);

		switch ($this->dataProvider) {
			case 'mixedCache':
				NFY_Mixed_Cache::saveCacheData("SmdReg:" . $md5key, $value);
				break;
			case 'session':
				$_SESSION[get_class() . ":" . $md5key] = $value;
				break;
			case 'self':
				$this->cachedData[get_class() . ":" . $md5key] = $value;
				break;
		}
	}

	/**
	 * Returns the value for $key.
	 * If there is no value set it returns (boolean) false
	 *
	 * @param $key
	 * @return bool|mixed
	 * @throws Exception
	 */
	public function get($key)
	{
		$md5key = md5($key);

		switch ($this->dataProvider) {
			case 'mixedCache':
				$cachedData = NFY_Mixed_Cache::getCacheData("SmdReg:" . $md5key, 6000);
				if ($cachedData) {
					$this->set($key, $cachedData);

					return $cachedData;
				}
				break;
			case 'session':
				if (isset($_SESSION[get_class() . ":" . $md5key])) {
					return $_SESSION[get_class() . ":" . $md5key];
				}
				break;
			case 'self':
				if (isset($this->cachedData[get_class() . ":" . $md5key])) {
					return $this->cachedData[get_class() . ":" . $md5key];
				}
				break;
		}

		return false;
	}
}