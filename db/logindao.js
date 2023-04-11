var db = require('./pgconnection');


// DAO method to store new login_info (return new user id)
exports.createAccount = async function (login, password) {
  return new Promise(function(resolve, reject){
    db.query('INSERT INTO public.login_info ( login, password) VALUES($1,$2) RETURNING id',[login, password], (error, results) => {
      if (error) {
        reject( error);
      }
      else resolve(results.rows[0].id);
    });
  });
};

exports.updatePassword = async function (login, password) {
  return new Promise(function(resolve, reject){
    db.query('UPDATE public.login_info SET password=$2 WHERE login=$1 RETURNING id',[login, password], (error, results) => {
      if (error) {
        reject( error);
      }
      else resolve(results.rows[0].id);
    });
  });
};

// DAO method to check pwd by login
exports.getAccountByLogin = async function (login) {
  return new Promise(function(resolve, reject){
    console.log(db);
    db.query('SELECT * from public.login_info WHERE login=$1',[login], (error, results) => {
      if (error) {
        reject( error)
      }
      try {
        resolve(results.rows);
      } catch (error) {
        reject( error)
      }
    });
  });
};

// DAO method to fetch all login_info
exports.getAllLogins = function () {
    return new Promise(function(resolve, reject){
        db.query('SELECT * from public.login_info', (error, results) => {
          if (error) {
              reject( error)
          }
          resolve(results.rows);
        })
        
  });
};

