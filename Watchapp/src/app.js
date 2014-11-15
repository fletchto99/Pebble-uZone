var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');

//Setup
Settings.config(
  { url: ('http://fletchto99.com/other/uzone-pebble/web/settings.html' + (Settings.data('username')? '?username='+encodeURIComponent(Settings.data('username')) : '')) },
  function(e) {
    if (!e.response){
        return;
    }
    var data = JSON.parse(decodeURIComponent(e.response));
    Settings.data('username', data.username);
    Settings.data('password', data.password);
    fetch();
  }
);

//Variables
var balance = new UI.Card({
    title: 'Balance',
    subtitle: 'Loading...'
});

var menuItems = [
    {
        title: 'Balance',
        subtitle: 'Meal & flex balance.'
    },
    {
        title: 'Meal History',
        subtitle: 'Last 10 meal purchases.'
    },
    {
        title: 'Flex History',
        subtitle: 'Last 10 flex purchases.'
    },
    {
        title: 'Deactivate',
        subtitle: 'Deactivate uOCard!'
    }
];

var mainMenu = new UI.Menu({
  sections: [{
    title: 'uOCard Options',
    items: menuItems
  }]
});

var loading = true;
var messages = ['Have some patience bro...', 'Waiting on uZone..', 'You already clicked me!', 'I\'m trying as hard as I can'];


//Show the menu
mainMenu.show();


//Menu actions
mainMenu.on('select', function(event) {
    if (event.itemIndex === 0) {
        balance.show();
        fetch();
    }
});


//Individual actions
balance.on('click', 'down', function() {
    balance.title('Balance');
    balance.subtitle('Loading...');
    if (!loading) {
        fetch();
    } else {
        loadingMessage();
    }
});


//Functions
function fetch() { 
    loading = true;
    if (Settings.data('username') && Settings.data('password')) {
        ajax({
            url: 'http://fletchto99.com/other/uzone-pebble/web/api.php',
            type: 'json',
            method: 'post',
            data:{
                username:Settings.data('username'),
                password:Settings.data('password'),
                method:'Balance'
            },
            cache: false
          },
          function(data) {
              if (data.error) {
                  prepareUI('Error', data.error);
              } else {
                  prepareUI('Balance', 'Meal: $' + data.meal + '\nFlex: $' + data.flex);
              }
          },
          function(error) {
              prepareUI('Error', 'Error contacting server.');
          });
    } else {
        prepareUI('Error', 'Username and password not configured.');
    }
}

function prepareUI(title, subtitle) {
    loading = false;
    balance.title(title);
    balance.subtitle(subtitle);
    balance.body('');
}

function loadingMessage() {
    balance.body(messages[Math.floor(Math.random() * 4)]);
}