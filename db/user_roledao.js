var db = require('./pgconnection');

const date = new Date();

// DAO method to store new login_info (return new user id)
exports.addUserRole = async function (user_id, role_id) {
  return new Promise(function(resolve, reject){
    db.query('INSERT INTO public.user_role ( user_id, role_id) VALUES($1,$2) RETURNING id',[user_id, role_id], (error, results) => {
      if (error) {
        reject( error);
      }
      else resolve(results.rows[0].id);
    });
  });
};

exports.removeUserRole = async function (user_id, role_id) {
    return new Promise(function(resolve, reject){
      db.query("DELETE FROM public.user_role WHERE user_id=$1 and role_id=$2",[user_id, role_id], (error, results) => {
        if (error) {
          reject( error)
        }
        // console.log(results);
        resolve(`Deleted role for user with ID: ${user_id}`);
      })
    });
  };

  // DAO method to check roles by user id
exports.getRolesByUserId = async function (id) {
  return new Promise(function(resolve, reject){
    db.query('SELECT * from public.user_role WHERE user_id=$1',[id], (error, results) => {
      if (error) {
        reject( error)
      }
      resolve(results.rows);
    });
  });
};