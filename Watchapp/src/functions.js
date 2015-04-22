var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');

var balance = require('balance');
var mealplan = require('mealplan');
var flexplan = require('flexplan');
var deactivate = require('deactivate');

var functions = module.exports;

//Variables
var balanceCard = new UI.Card({
    title: 'Balance',
    subtitle: 'Loading...'
});

//Functions
functions.setup = function setup() { 
    var loading = functions.showCard('uOCard Pebble', 'Loading...', '');
    balanceCard.on('click', 'down', function() {
            balance.fetch(balanceCard);
    });
    if (Settings.data('username') && Settings.data('password')) {
        ajax({
            url: 'http://fletchto99.com/other/pebble/uzone/web/api.php',
            type: 'json',
            method: 'post',
            data:{
                username:Settings.data('username'),
                password:Settings.data('password'),
                method:'MealPlanCheck'
            },
            cache: false
        },
             function(data) {
                 if (data.error) {
                     functions.showAndRemoveCard('Error', data.error, '', loading);
                 } else {
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
                     if(data.active ==='no') {
                         menuItems = [
                             {
                                 title: 'Balance',
                                 subtitle: 'Meal & flex balance.'
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

                     }
                     loading.hide();
                     var mainMenu = new UI.Menu({
                         sections: [{
                             title: 'uOCard Options',
                             items: menuItems
                         }]
                     });
                     mainMenu.show();
                     if (data.active === 'yes') {
                         mainMenu.on('select', function(event) {                 
                             if (event.itemIndex === 0) {
                                 balance.fetch(balanceCard);
                             }
                             if (event.itemIndex === 1) {
                                 mealplan.fetch();
                             }
                             if (event.itemIndex === 2) {
                                 flexplan.fetch();
                             }
                             if (event.itemIndex === 3) {
                                 deactivate.fetch();
                             }

                         });
                     } else {
                         mainMenu.on('select', function(event) {                 
                             if (event.itemIndex === 0) {
                                 balance.fetch(balanceCard);
                             }
                             if (event.itemIndex === 1) {
                                 flexplan.fetch();
                             }
                             if (event.itemIndex === 2) {
                                 deactivate.fetch();
                             }

                         });
                     }
                 }
             },
             function(error) {
                 functions.showAndRemoveCard('Error', 'Error contacting server.', '', loading);
             });
    } else {
        functions.showAndRemoveCard('Error', 'Username and password not configured.', '', loading);
    }
};

functions.getSetting = function getSetting(setting) {
   return Settings.data(setting);
};

functions.showCard = function showCard(title, subtitle, body) {
    console.log('Body is ' + body);
    return functions.showAndRemoveCard(title, subtitle, body, null);
};

functions.showAndRemoveCard = function showAndRemoveCard(title, subtitle, body, old) {
    if (old !== null) {
        old.hide();
    }
    var card = new UI.Card({title: title,subtitle: subtitle, body: body});
    card.show();
    return card;
};

functions.updateCard = function updateCard(title, subtitle, card) {
    card.title(title);
    card.subtitle(subtitle);
    card.show();
};