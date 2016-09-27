var express = require('express');

module.exports = function () {
    var app = express();

    // variável de ambiente
    app.set('port', 3000);

    // middleware
    app.use(express.static(__dirname + '/public'));

    return app;
}