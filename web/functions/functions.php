<?php

require_once('Balance.php');

class Functions
{

    private $username = null;
    private $password = null;
    private $config = array();

    private $result = array('error' => 'Username or password not configured correctly.');

    function __construct($config, $username, $password)
    {
        $this->config = $config;
        $this->username = $username;
        $this->password = $password;
    }

    function execute($method)
    {
        if ($this->username && $this->password) {
            switch ($method) {
                case 'Balance':
                    $balance = new Balance($this->username, $this->password, $this->config['ID'], $this->config['URL']);
                    $this->result = $balance-> execute();
                    break;
                case 'MealHistory':
                    $this->result['error'] = 'Meal plan history is not yet implemented.';
                    break;
                case 'FlexHistory':
                    $this->result['error'] = 'Flex plan history is not yet implemented.';
                    break;
                case 'Deactivate':
                    $this->result['error'] = 'Deactivating your card is not yet implemented.';
                    break;
                default:
                    $this->result['error'] = 'Error executing option, please try again later.';
                    break;
            }
        }
        echo json_encode($this->result);
    }

}

?>