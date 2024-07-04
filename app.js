require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// --- DATABASE config
require('./config/database');

// --- Passport jwtStrategy config
const passport = require('passport');
require('./config/passport')(passport);

// --- Passport LocalStrategy & serialization setup.
// const LocalStrategy = require('passport-local').Strategy;
// const User = require('./models/user');
// const { validatePassword } = require('./lib/passwordUtils');

// const strategy = new LocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password',
// },
// (email, password, done) => {
//   User.findOne({ email })
//     .then((user) => {
//       if (!user) return done(null, false);

//       const { hash, salt } = user;
//       const isValid = validatePassword(password, hash, salt);

//       if (isValid) {
//         return done(null, user);
//       } else {
//         return done(null, false);
//       }
//     })
//     .catch((err) => done(err));
// });
// passport.use(strategy);

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((userId, done) => {
//   User.findById(userId)
//     .then((user) => {
//       done(null, user);
//     })
//     .catch((err) => done(err));
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --- Import all the routes from ./routes/index.js
app.use(require('./routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
