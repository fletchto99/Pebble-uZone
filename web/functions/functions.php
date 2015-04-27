<?php

require_once('inc/simple_html_dom.php');
require_once('inc/uCardScrape.php');

require_once('Balance.php');
require_once('Deactivate.php');
require_once('MealHistory.php');
require_once('FlexHistory.php');
require_once('MealPlanCheck.php');

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
                case 'CheckLogin':
                    $form = array('ID' => $this->config['ID'], 'name' => $this->username, 'pass' => $this->password, 'optStudent' => 'optStudent');
                    $login = self::checkLogin($form, $this->config['LOGIN_URL']);
                    $this->result = array('login' => ($login ? 'success' : 'failed'));
                    break;
                case 'MealPlanCheck':
                    $balance = new MealPlanCheck($this->username, $this->password, $this->config['ID'], $this->config['LOGIN_URL']);
                    $this->result = $balance->execute();
                    break;
                case 'Balance':
                    $balance = new Balance($this->username, $this->password, $this->config['ID'], $this->config['BALANCE_URL']);
                    $this->result = $balance->execute();
                    break;
                case 'MealHistory':
                    $meal = new MealHistory($this->username, $this->password, $this->config['ID'], $this->config['HISTORY_URL']);
                    $this->result = $meal->execute();
                    break;
                case 'FlexHistory':
                    $flex = new FlexHistory($this->username, $this->password, $this->config['ID'], $this->config['HISTORY_URL']);
                    $this->result = $flex->execute();
                    break;
                case 'Deactivate':
                    $deactivate = new Deactivate($this->username, $this->password, $this->config['ID'], $this->config['DEACTIVATE_URL']);
                    $this->result = $deactivate->execute();
                    break;
                default:
                    $this->result['error'] = 'Error executing option, please try again later.';
                    break;
            }
        }
        echo json_encode($this->result);
    }

    static function findElement($html, $class, $pos)
    {
        $DOM = new simple_html_dom();
        $DOM->load($html);
        if ($DOM->find($class)) {
            return array_values($DOM->find($class))[$pos];
        }
        return false;
    }

    static function elementToPlaintext($DOMelement)
    {
        return $DOMelement->plaintext;
    }

    static function findElements($html, $class)
    {
        $DOM = new simple_html_dom();
        $DOM->load($html);
        if ($DOM->find($class)) {
            return $DOM->find($class);
        }
        return null;
    }

    static function checkLogin($form_fill, $url)
    {
        $scrape = new uCardScrape($url, $form_fill);
        $html = $scrape->fetchResult();

        if (strpos($html, 'Login failed for Student number') !== false) {
            return '';
        }
        return $html;
    }

}

?>