var functions = require('functions');
var UI = require('ui');
var ajax = require('ajax');
var config = require('Config.json');

var flexplan = require('flexplan');

flexplan.fetch = function fetch() {
    var card = functions.showCard('Flex History', 'Loading...', '');
    if (functions.getSetting('username') && functions.getSetting('password')) {
        ajax({
                url: config.API_URL,
                type: 'json',
                method: 'post',
                data: {
                    username: functions.getSetting('username'),
                    password: functions.getSetting('password'),
                    method: 'FlexHistory'
                },
                cache: false
            },
            function (data) {
                if (data.error) {
                    functions.showAndRemoveCard('Error', data.error, '', card);
                } else {
                    card.hide();
                    var menuItems = Array(data.length);
                    for (var i = 0; i < data.length; i++) {
                        menuItems[i] = {
                            title: data[i].price,
                            subtitle: data[i].date,
                            description: data[i].description
                        };
                    }
                    var history = new UI.Menu({
                        sections: [{
                            title: 'Flexplan History',
                            items: menuItems
                        }]
                    });
                    history.on('select', function (event) {
                        functions.showCard(menuItems[event.itemIndex].title, menuItems[event.itemIndex].subtitle, menuItems[event.itemIndex].description);
                    });
                    history.show();
                }
            },
            function (error) {
                functions.showAndRemoveCard('Error', 'Error contacting server.', '', card);
            });
    } else {
        functions.showAndRemoveCard('Error', 'Username and password not configured.', '', card);
    }
};
