//Imports
var Settings = require('settings');
var functions = require('functions');

//Load the settings
Settings.config(
  { url: ('http://fletchto99.com/other/pebble/uzone/web/settings.html' + (Settings.data('username')? '?username='+encodeURIComponent(Settings.data('username')) : '')) },
  function(e) {
    if (!e.response){
        return;
    }
    var data = JSON.parse(decodeURIComponent(e.response));
    Settings.data('username', data.username);
    Settings.data('password', data.password);
  }
);

//Setup the app
functions.setup();