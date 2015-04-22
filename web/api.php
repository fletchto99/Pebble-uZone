<?php
require_once('configuration.php');
require_once('functions/functions.php');
$params = null;
if (count($_POST) == 0) {
    $params = json_decode(file_get_contents('php://input'), true);
} else {
    $params = $_POST;
}
if ($params !== null) {
    $functions = new functions(Configuration::getConfiguration(), $params['username'], $params['password']);
    $functions->execute($params['method']);
} else {
    echo json_encode(array('error' => 'Server side error, please try again later.'));
}
?>