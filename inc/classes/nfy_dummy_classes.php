<?php
/**
 * Quick and dirty dummy classes to get the MVC work without redFACT
 */

abstract class NFY_Mixed_Base 
{
    public static final function infoLog($logMessage, $logFilename=null)
    {
        self::debugLog($logMessage, $logFilename);
    }
    public static final function debugLog($logMessage, $logFilename=null)
    {
        file_put_contents(dirname(__FILE__) . "/../../" . ($logFilename ?: "debug.log"), $logMessage);
    }
    public static final function deprecateLog($logMessage, $logFilename=null)
    {
        self::debugLog($logMessage, $logFilename);
    }
    public static final function warnLog($logMessage, $logFilename=null)
    {
        self::debugLog($logMessage, $logFilename);
    }
    public static final function errorLog($logMessage, $logFilename=null)
    {
        self::debugLog($logMessage, $logFilename);
    }
}
final class NFY_Tools_Mime extends NFY_Mixed_Base 
{
    const CONTENT_TYPE_JSON = 'application/json';
}