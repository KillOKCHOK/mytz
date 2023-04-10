var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var  logindao = require('./db/logindao');
var  user_roledao = require('./db/user_roledao');
var sha256 = require('sha256');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registrationRouter = require('./routes/registration');
var loginRouter = require('./routes/login');
var roleRouter = require('./routes/roles');
var updatepwdRouter = require('./routes/updatepwd');
require('dotenv').config()
const authenticateToken = require('./security/jwtmiddleware');
var app = express();



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/registration', registrationRouter);
app.use('/login', loginRouter);
app.use('/changepassword', authenticateToken, updatepwdRouter);
app.use('/users', authenticateToken, usersRouter);
app.use('/roles', authenticateToken, roleRouter);

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

//////////initial db script//////////////////
// Create admin account
logindao.getAccountByLogin("admin@mail.com")
.then(result=>{
  console.log(result)
  if(!result[0]){
    logindao.createAccount("admin@mail.com",sha256("root"))
    .then(adminId=>{
      user_roledao.addUserRole(adminId,1)
      .then(roleId=>{
        console.log("Created admin role with id: "+roleId)
      })
      .catch(err=>{
        console.log("Was not able to save admin role info")
        console.log(err)
      })
    })
    .catch(err=>{
      console.log("Was not able to save admin login info")
      console.log(err)
    })
  }
}).catch(err=>{
  console.log("Was not able to fetch admin login info")
  console.log(err)
})


module.exports = app;
