var colors = require('colors/safe');

module.exports = {
    info: function (message) {
        console.log(colors.green('[scafall] ' + message));
    },
    error: function (message){
        console.error(colors.red('[scafall] ' + message));
    }
};
