<?php

require_once('configuration.php');
require_once('functions/functions.php');

$params = json_decode(file_get_contents('php://input'), true);

$functions = new functions(Configuration::getConfiguration(), $params['username'], $params['password']);
$functions -> execute($params['method']);

?>