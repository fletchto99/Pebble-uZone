<?php

class uCardScrape
{
    private $url = null;
    private $form = null;
    private $cookie = "cookie.txt";

    /*Data generated from cURL*/
    public $content = null;
    public $response = null;

    /* Fields */
    public $data = array();

    public function __construct($url, $form)
    {
        $this->url = $url;
        $this->form = $form;
    }

    public function fetchResult()
    {
        $this->cURL($this->url);
        if ($this->form) {
            if ($form_fill = $this->getFormFields($this->content, $this->form['ID'])) {
                $form_fill['ctl00$lgnView$cpLogin$lgnLogin$lgnLogin$UserName'] = $this->form['name'];
                $form_fill['ctl00$lgnView$cpLogin$lgnLogin$lgnLogin$Password'] = $this->form['pass'];
                $form_fill['ctl00$lgnView$cpLogin$lgnLogin$lgnLogin$Type'] = $this->form['optStudent'];
                $this->cURL($this->url, $form_fill);
                return $this->content;
            }
        }
        return $this->content;
    }

    /* Scan for form */
    private function getFormFields($data, $id)
    {
        if (preg_match('/(<form.*?id=.?' . $id . '.*?<\/form>)/is', $data, $matches)) {
            $inputs = $this->getInputs($matches[1]);

            return $inputs;
        } else {
            return false;
        }

    }

    /* Get Inputs in form */
    private function getInputs($form)
    {
        $inputs = array();

        $elements = preg_match_all('/(<input[^>]+>)/is', $form, $matches);

        if ($elements > 0) {
            for ($i = 0; $i < $elements; $i++) {
                $el = preg_replace('/\s{2,}/', ' ', $matches[1][$i]);

                if (preg_match('/name=(?:["\'])?([^"\'\s]*)/i', $el, $name)) {
                    $name = $name[1];
                    $value = '';

                    if (preg_match('/value=(?:["\'])?([^"\']*)/i', $el, $value)) {
                        $value = $value[1];
                    }

                    $inputs[$name] = $value;
                }
            }
        }

        return $inputs;
    }

    private function cURL($url, $post = false)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
        curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.101 Safari/537.36");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_VERBOSE, 1);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 120);
        curl_setopt($ch, CURLOPT_TIMEOUT, 120);
        curl_setopt($ch, CURLOPT_COOKIEFILE, $this->cookie);
        curl_setopt($ch, CURLOPT_COOKIEJAR, $this->cookie);

        if ($post)
        {
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));
        }

        curl_setopt($ch, CURLOPT_URL, $url);

        $this->content = curl_exec($ch);
        $this->response = curl_getinfo($ch);
        curl_close($ch);
    }
}

?>