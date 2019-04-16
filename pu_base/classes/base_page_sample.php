<?php

/**
 * Class base_page_sample
 *
 * @author  Matthias Weiß <m.weiss@smdigital.de>
 * @version 0.0
 * @changes
 * @url
 *
 * for class documentation look at Mvc_Base
 */
class base_page_sample extends Mvc_Base
{
	protected $objectDataFields         = ['username', 'password', 'email'];

	public function __construct($moddata = [])
	{
		parent::__construct($moddata);
	}

	public function validate($name, $value)
	{
		$returnData = ['code' => false, 'message' => ''];

		//put validation code here
		switch ($name) {
			case 'username':
			case 'password':
			case 'email':
				$returnData['code'] = true;
				break;
		}
		
		if ($returnData['code'] === true) {
			$this->setObjectData($name, $value);
		}

		return $returnData;
	}

	public function save($name, $value) 
	{
		return $this->getObjectData();
	}
}