<?php

require_once('inc/simple_html_dom.php');
require_once('inc/uCardScrape.php');

class Balance
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
        $arr = array('error' => 'Username or password not configured.');
        if ($this->username && $this->password) {
            $form = array('ID' => $this->ID, 'name' => $this->username, 'pass' => $this->password, 'optStudent' => 'optStudent');
            $scrape = new uCardScrape($this->url, $form);
            $html = $scrape->login();
            $flex = $this ->findElement($html, '#ctl00_lgnView_cpMain_ctlABalances_grdAccounts', 0);
            if ($flex) {
                $flex = $this -> findElement($flex, '.balancesFooter', 0);
                $flex = preg_replace('/[^0-9\.]/', '', $flex);
            }

            $meal = $this ->findElement($html, '#ctl00_lgnView_cpMain_ctlABalances_grdUsedMeals', 0);
            if ($meal) {
                $meal = $this -> findElement($this -> findElement($meal, '.balancesRow', 0), 'td', 4);
                $meal = preg_replace('/[^0-9\.]/', '', $meal);
            }
            $arr = array('meal' => $meal?$meal:'null', 'flex' => ($flex?$flex:'null'));
        }
        return $arr;

    }

    function findElement($html, $class, $pos)
    {
        $DOM = new simple_html_dom();
        $DOM->load($html);
        if ($DOM->find($class)) {
            return array_values($DOM->find($class))[$pos];
        }
        return false;
    }
}

?>