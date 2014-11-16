<?php

require_once('functions.php');

class Deactivate
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
                $flex = functions::findElement($html, '#ctl00_lgnView_cpMain_ctlABalances_grdAccounts', 0);
                if ($flex) {
                    $flex = functions::findElement($flex, '.balancesFooter', 0);
                    $flex = preg_replace('/[^0-9\.]/', '', $flex);
                }

                $meal = functions::findElement($html, '#ctl00_lgnView_cpMain_ctlABalances_grdUsedMeals', 0);
                if ($meal) {
                    $meal = functions::findElement(functions::findElement($meal, '.balancesRow', 0), 'td', 4);
                    $meal = preg_replace('/[^0-9\.]/', '', $meal);
                }
                $arr = array('meal' => $meal ? $meal : 'null', 'flex' => ($flex ? $flex : 'null'));
            }
        }
        return $arr;

    }
}

?>