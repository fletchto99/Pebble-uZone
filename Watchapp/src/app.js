//Imports
var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');

//Variables
var balance = new UI.Card({
    title: 'Balance',
    subtitle: 'Loading...'
});

var loading = new UI.Card({
    title: 'uOCard Pebble',
    subtitle: 'Loading...'
});

var fetchingBalance = true;


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
    loading.show();
    setup();
  }
);

//Show the menu
loading.show();
setup();


//Individual actions
balance.on('click', 'down', function() {
    if (!fetchingBalance) {
        updateCard('Balance', 'Loading...', balance);
        fetchBalance();
    } 
});


//Functions
function setup() { 
    if (Settings.data('username') && Settings.data('password')) {
        ajax({
            url: 'http://fletchto99.com/other/uzone-pebble/web/api.php',
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
                     showCard('Error', data.error, loading).show();
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
                              fetchBalance();
                          }
                          if (event.itemIndex === 1) {
                              fetchMealHistory();
                          }
                          if (event.itemIndex === 2) {
                              fetchFlexHistory();
                          }
                          if (event.itemIndex === 3) {
                              showCard('Deactivate', 'This is a work in progress.');
                          }

                  });
                  } else {
                      mainMenu.on('select', function(event) {                 
                          if (event.itemIndex === 0) {
                              fetchBalance();
                          }
                          if (event.itemIndex === 1) {
                              fetchFlexHistory();
                          }
                          if (event.itemIndex === 2) {
                              showCard('Deactivate', 'This is a work in progress.');
                          }

                  });
                  }
              }
          },
          function(error) {
              showCard('Error', 'Error contacting server.', loading).show();
          });
    } else {
        showCard('Error', 'Username and password not configured.');
    }
}

function fetchBalance() { 
    fetchingBalance = true;
    balance.show();
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
                  showCard('Error', data.error);
                  fetchingBalance = false;
              } else {
                  updateCard('Balance', (data.meal != 'null'? 'Meal: $' + data.meal + '\n' : '') + 'Flex: $' + data.flex, balance);
                  fetchingBalance = false;
              }
          },
          function(error) {
              showCard('Error', 'Error contacting server.');
              fetchingBalance = false;
          });
    } else {
        showCard('Error', 'Username and password not configured.');
        fetchingBalance = false;
    }
}

function fetchMealHistory() { 
    var card = showCard('Meal History', 'Loading...');
    if (Settings.data('username') && Settings.data('password')) {
        ajax({
            url: 'http://fletchto99.com/other/uzone-pebble/web/api.php',
            type: 'json',
            method: 'post',
            data:{
                username:Settings.data('username'),
                password:Settings.data('password'),
                method:'MealHistory'
            },
            cache: false
          },
          function(data) {
              if (data.error) {
                  showCard('Error', data.error, card);
              } else {
                  card.hide();
                  var menuItems = Array(data.length);
                  for(var i=0;i<data.length;i++){
                      menuItems[i] = {
                          title: data[i].price,
                          subtitle: data[i].date,
                          description:data[i].description
                      };
                  }
                  var history = new UI.Menu({
                      sections: [{
                          title: 'Mealplan History',
                          items: menuItems
                      }]
                  });
                  history.on('select', function(event) {
                      showCard(menuItems[event.itemIndex].title, menuItems[event.itemIndex].subtitle, menuItems[event.itemIndex].description);
                  });
                  history.show();
              }
          },
          function(error) {
              showCard('Error', 'Error contacting server.', card);
          });
    } else {
        showCard('Error', 'Username and password not configured.', card);
    }
}

function fetchFlexHistory() { 
    var card = showCard('Flex History', 'Loading...');
    if (Settings.data('username') && Settings.data('password')) {
        ajax({
            url: 'http://fletchto99.com/other/uzone-pebble/web/api.php',
            type: 'json',
            method: 'post',
            data:{
                username:Settings.data('username'),
                password:Settings.data('password'),
                method:'FlexHistory'
            },
            cache: false
          },
          function(data) {
              if (data.error) {
                  showCard('Error', data.error, card);
              } else {
                  card.hide();
                  var menuItems = Array(data.length);
                  for(var i=0;i<data.length;i++){
                      menuItems[i] = {
                          title: data[i].price,
                          subtitle: data[i].date,
                          description:data[i].description
                      };
                  }
                  var history = new UI.Menu({
                      sections: [{
                          title: 'Flexplan History',
                          items: menuItems
                      }]
                  });
                  history.on('select', function(event) {
                      showCard(menuItems[event.itemIndex].title, menuItems[event.itemIndex].subtitle, menuItems[event.itemIndex].description);
                  });
                  history.show();
              }
          },
          function(error) {
              showCard('Error', 'Error contacting server.', card);
          });
    } else {
        showCard('Error', 'Username and password not configured.', card);
    }
}


function showCard(title, subtitle, old) {
    old.hide();
    showCard(title, subtitle);
}

function showCard(title, subtitle) {
    return new UI.Card({title: title,subtitle: subtitle}).show();
}

function showCard(title, subtitle, body) {
    return new UI.Card({title: title,subtitle: subtitle, body: body}).show();
}

function updateCard(title, subtitle, card) {
    card.title(title);
    card.subtitle(subtitle);
}