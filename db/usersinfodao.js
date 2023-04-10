var db = require('./pgconnection');

const date = new Date();

// DAO method to store new login_info (return new user id)
exports.addUserInfo = async function (name, surname, position, phone, manager_id, login_id) {
  return new Promise(function(resolve, reject){
    db.query('INSERT INTO public.users ( name, surname, position, phone, manager_id, login_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING id',[name, surname, position, phone, manager_id, login_id], (error, results) => {
      if (error) {
        reject( error);
      }
      else resolve(results.rows[0].id);
    });
  });
};

exports.updateUserInfo = async function (name, surname, position, phone, manager_id, login_id) {
    return new Promise(function(resolve, reject){
      db.query('UPDATE public.users SET name=$1, surname=$2, position=$3, phone=$4, manager_id=$5 WHERE login_id=$6 RETURNING id',[name, surname, position, phone, manager_id, login_id], (error, results) => {
        if (error) {
          reject( error);
        }
        else resolve(results.rows[0].id);
      });
    });
  };

exports.removeUserInfo = async function (id) {
    return new Promise(function(resolve, reject){
      db.query("DELETE FROM public.users WHERE login_id=$1 ",[id], (error, results) => {
        if (error) {
          reject( error)
        }
        // console.log(results);
        resolve(`Deleted userinfo with ID: ${id}`);
      })
    });
  };

  // DAO method to check users by user id
exports.getUserByLoginId = async function (id) {
  return new Promise(function(resolve, reject){
    db.query('SELECT * from public.users WHERE login_id=$1',[id], (error, results) => {
      if (error) {
        reject( error)
      }
      resolve(results.rows);
    });
  });
};
  // DAO method to check users by user id
exports.getUserById = async function (id) {
  return new Promise(function(resolve, reject){
    db.query('SELECT * from public.users WHERE id=$1',[id], (error, results) => {
      if (error) {
        reject( error)
      }
      resolve(results.rows);
    });
  });
};
  // DAO method to check users by user id asynchronously
exports.getUserByIdAsynch = async function (id) {
  return await db.query('SELECT * FROM public.users WHERE manager_id = $1', [id]);
};

exports.getAllUsers = async function (id) {
  return new Promise(function(resolve, reject){
    db.query('SELECT * from public.users ', (error, results) => {
      if (error) {
        reject( error)
      }
      resolve(results.rows);
    });
  });
};

