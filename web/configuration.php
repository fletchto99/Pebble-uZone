<?php

class Configuration {

    static function getConfiguration() {
        $config['LOGIN_URL'] = 'https://carteuottawacard.uottawa.ca/login.aspx?option=0&LanguagePreference=0';
        $config['ACCOUNT_URL'] = 'https://carteuottawacard.uottawa.ca/login.aspx?option=0&LanguagePreference=0';
        $config['BALANCE_URL'] = 'https://carteuottawacard.uottawa.ca/login.aspx?option=0&LanguagePreference=0';
        $config['FLEX_HISTORY_URL'] = 'https://carteuottawacard.uottawa.ca/login.aspx?option=0&LanguagePreference=0&ReturnUrl=%2facc_history.aspx%3Facc%3D1';
        $config['MEAL_HISTORY_URL'] = 'https://carteuottawacard.uottawa.ca/login.aspx?option=0&LanguagePreference=0&ReturnUrl=%2facc_history.aspx%3Facc%3D2';
        $config['ID'] = 'aspnetForm';

        return $config;
    }
}

?>