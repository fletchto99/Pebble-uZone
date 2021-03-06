var functions = require('functions');
var ajax = require('ajax');
var config = require('Config.json');

var fetchingBalance = false;

var balance = module.exports;

balance.fetch = function fetch(card) {
    if (!fetchingBalance) {
        fetchingBalance = true;
        functions.updateCard('Balance', 'Loading...', card);
        if (functions.getSetting('username') && functions.getSetting('password')) {
            ajax({
                    url: config.API_URL,
                    type: 'json',
                    method: 'post',
                    data: {
                        username: functions.getSetting('username'),
                        password: functions.getSetting('password'),
                        method: 'Balance'
                    },
                    cache: false
                },
                function (data) {
                    if (data.error) {
                        functions.showAndRemoveCard('Error', data.error, '', card);
                        fetchingBalance = false;
                    } else {
                        functions.updateCard('Balance', (data.meal != 'null' ? 'Dining: $' + data.meal + '\n' : '') + 'Flex: $' + data.flex, card);
                        fetchingBalance = false;
                    }
                },
                function (error) {
                    functions.showAndRemoveCard('Error', 'Error contacting server.', '', card);
                    fetchingBalance = false;
                });
        } else {
            functions.showAndRemoveCard('Error', 'Username and password not configured.', '', card);
            fetchingBalance = false;
        }
    }
};