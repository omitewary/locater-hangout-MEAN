var mongoose = require('mongoose');
var gracefulShutdown;
//define database connection and open mongoose connection
var dbURI = 'mongodb://localhost/Loc8r';
var x = process.env.NODE_ENV;
console.log('x',x);
if(process.env.NODE_ENV === 'production') {
    dbURI = process.env.MONGOLAB_URI;
}
console.log('port',process.env.PORT);
mongoose.connect(dbURI);
//Monitoring connection
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
   console.log('Error in connection ' + err);
});
mongoose.connection.on('dicconnected', function() {
    console.log('Mongoose disconnected');
});
//close mongoose connection
gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};
//For nodemon restarts
process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});
//App Termination
process.on('SIGINT', function() {
    gracefulShutdown('App termination', function() {
        process.exit(0);
    });
});
//For Heroku app termination
process.on('SIGTERM', function() {
   gracefulShutdown('Heroku APP termination', function() {
       process.exit(0);
   });
});

require('./locations');
require('./users');
