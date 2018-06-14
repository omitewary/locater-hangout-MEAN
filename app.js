require('dotenv').load() ;
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var debuglog = require('debug-log');
require('./app_api/models/db');
require('./app_api/config/passport');
var uglifyJs = require('uglify-js');
var fs = require('fs');

//var routes = require('./app_server/routes/index');
var routesAPI = require('./app_api/routes/index');
var users = require('./app_server/routes/users');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');
/*var appCLientFiles = [
    'app_client/app.js',
    'app_client/home/home.controller.js',
    'app_client/about/about.controller.js',
    'app_client/locationDetail/locationDetail.controller.js',
    'app_client/commons/services/loc8rData.service.js',
    'app_client/commons/services/geolocation.service.js',
    'app_client/commons/services/loc8rData.service.js',
    'app_client/commons/filter/formatDistance.filter.js',
    'app_client/commons/directive/ratingStars/ratingStars.directive.js',
    'app_client/commons/directive/footerGeneric/footerGeneric.directive.js',
    'app_client/commons/directive/navigation/navigation.directive.js',
    'app_client/commons/directive/pageHeader/pageHeader.directive.js'
];*/

/*var uglified = uglifyJs.minify(appCLientFiles, {compress : false});
fs.writeFile('public/angular/loc8r.min.js', uglified.code, function(err) {
    if(err) {
        console.log(err);
    } else  {
        console.log('Script generatedand saved: loc8r.min.js');
    }
})*/
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));
app.use(passport.initialize());
//app.use('/', routes);
app.use('/api', routesAPI);
app.use('/users', users);
app.use(function(req, res) {
    res.sendfile(path.join(__dirname, 'app_client', 'index.html'));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
//catch unauthorize errors
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({"message" : err.name + ": " + err.message});
    }
});
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
