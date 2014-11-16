<?php

require_once('functions.php');

class MealPlanCheck
{

    private $username = null;
    private $password = null;
    private $ID = null;
    private $url = null;

    function __construct($username, $password, $ID, $url)
    {
        $this->username = $username;
        $this->password = $password;
        $this->ID = $ID;
        $this->url = $url;
    }

    function execute()
    {
        $arr = array('error' => 'Username or password invalid!');
        if ($this->username && $this->password) {
            $form = array('ID' => $this->ID, 'name' => $this->username, 'pass' => $this->password, 'optStudent' => 'optStudent');
            $html = functions::checkLogin($form, $this->url);
            if ($html) {
                return array('active' => (strpos($html, 'Plan is not purchased') ? 'no' : 'yes'));
            }
        }
        return $arr;

    }
}

?>