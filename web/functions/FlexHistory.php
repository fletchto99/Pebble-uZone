<?php

require_once('functions.php');

class FlexHistory
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
            $html = functions::getPageResult($form, $this->url);
            if ($html) {
                $history = functions::findElement($html, '#ctl00_lgnView_cpMain_uiHistory_grdHistory', 0);
                $rows = functions::findElements($history, '.historyRow,.historyAlternatingRow');
                if ($rows) {
                    $i = 0;
                    $arr = array();
                    foreach ($rows as $row) {
                        $arr['row_'.$i] = array('date' => functions::elementToPlaintext(functions::findElement($row, 'td', 0)),
                            'price' => functions::elementToPlaintext(functions::findElement($row, 'td', 1)),
                            'description' => functions::elementToPlaintext(functions::findElement($row, 'td', 4)));
                        $i++;
                    }
                } else {
                    $arr = array('error' => 'No history to show.');
                }
            }
        }
        return $arr;
    }
}

?>