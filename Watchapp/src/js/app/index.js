//Imports
var Settings = require('settings');
var functions = require('functions');
var config = require('Config.json');

var card = null;

//Load the settings
Settings.config(
    {url: config.SETTINGS_URL},
    function (e) {
        if (card != null) {
            var temp = functions.init();
            card.hide();
            card = temp;
        }
    }
);

//Setup the app
setTimeout(function() {
    card = functions.init();
}, 800);