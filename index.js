const pkg = {
    express : require('express'),
    mongoose : require('mongoose'),
    passport : require('passport'),
    morgan : require('morgan'),
    flash : require('connect-flash'),
    fs : require('fs'),
    path : require('path'),
    cookieParser : require('cookie-parser'),
    bodyParser : require('body-parser'),
    session : require('express-session'),
    monk : require('monk')
};
const app = pkg.express();
const port = process.env.PORT || 2002;
app.use(pkg.express.static(pkg.path.join(__dirname, 'public')));
const config = require('./config/config');
var passport = require('passport');


/* DB Config */
pkg.mongoose.connect(config.dbURI, { useNewUrlParser: true, useUnifiedTopology: true }); // Mongoose for login
var db = pkg.monk(config.dbURI); // Monk For API View

app.use(function(req, res, next) { req.db = db;
    next(); })
require('./routes/passport')(pkg.passport);

app.use(pkg.morgan('dev'));
app.use(pkg.cookieParser());

app.use(pkg.bodyParser());

app.set('view engine', 'ejs');
app.use(pkg.express.static(pkg.path.join(__dirname, 'public')));
app.use(pkg.session({ secret: "2181616A8D5AD45EE3A64BE1B325F", saveUninitialized: false, resave: true }));
app.use(pkg.passport.initialize());
app.use(pkg.passport.session());
app.use(pkg.flash());


require('./routes/login')(app,passport)

app.listen(port);
console.log('Application Running on Port:' + port);