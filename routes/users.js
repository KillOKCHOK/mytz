var express = require('express');
var router = express.Router();
var  user_roledao = require('../db/user_roledao');
var sha256 = require('sha256');
const jwt = require('jsonwebtoken');
var  usersinfodao = require('../db/usersinfodao');
var db = require('../db/pgconnection');

/* GET users listing. */
router.get('/', function(req, res, next) {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.substring(7,authHeader.length);
  var decoded = jwt.decode(token, {complete: true}).payload;
  let admin = false;
  let boss = false;
  let userRoles = decoded.roles;
  // console.log(decoded);
  userRoles.forEach(element => {
      if(element.role_id==1){
          admin = true;
      }
      if(element.role_id==3){
          boss = true;
      }
  });
  if(admin){
    usersinfodao.getAllUsers().then(response=>{
      res.send(response);
      console.log(response);
    }
    ).catch(err=>{
      console.log(err);
      res.send(err);
    })
  }else if (boss){
    // console.log("BOSS");
    // res.send("BOSS");
    let response = {};
    usersinfodao.getUserByLoginId(decoded.userId).then(async response=>{
      if(response[0]){
        // get users
        await recursionFetch(response[0], res)
        // res.send(response[0]);
      }else{
        console.log("users route, was not able to find user by login id in if boss statement");
        res.sendStatus(500);
      }
    }).catch(err=>{
      console.log(err);
      res.send(err);
    })
  }else{
    usersinfodao.getUserByLoginId(decoded.userId).then(response=>{
      res.send(response);
      console.log(response);
    }).catch(err=>{
      console.log(err);
      res.send(err);
    })
  }
});

//**Didnt work with nesting */
// let recursionFetch = async function(result, response){
//   const { rows } = await usersinfodao.getUserByIdAsynch(result.id);
//   result.employees = rows;
//   for (let i = 0; i < result.employees.length; i++) {
//     let nextRows = await usersinfodao.getUserByIdAsynch(result.employees[i].id);
//     if(nextRows.rows){
//       for (let j = 0; j < nextRows.rows.length; j++) {
//         let lastNestLevel = await usersinfodao.getUserByIdAsynch(nextRows.rows[j].id);
//         nextRows.rows[j].employees = lastNestLevel.rows;
//       }
//     }
//     result.employees[i].employees = nextRows.rows;
//   }
//     response.send(result);
//   return rows
// }

//**get users by id */
router.get('/:id', function(req, res, next) {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.substring(7,authHeader.length);
  var decoded = jwt.decode(token, {complete: true}).payload;
  let admin = false;
  let userRoles = decoded.roles;
  // console.log(userRoles);
  userRoles.forEach(element => {
      if(element.role_id==1){
          admin = true;
      }
  });
  // console.log("req.user.id");
  // console.log(req.user.userId);
  if(admin | req.user.userId==req.params.id){
    usersinfodao.getUserByLoginId(req.params.id).then(response=>{
      res.send(response);
      console.log(response);
    }).catch(err=>{
      console.log(err);
      res.send(err);
    })
  }else{
    console.log("Not admin or user with current id 403");
    res.sendStatus(403);
  }
});

router.delete('/:id', function(req, res, next) {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.substring(7,authHeader.length);
  var decoded = jwt.decode(token, {complete: true}).payload;
  let admin = false;
  let userRoles = decoded.roles;
  // console.log(userRoles);
  userRoles.forEach(element => {
      if(element.role_id==1){
          admin = true;
      }
  });
  console.log("req.user.id");
  console.log(req.user.userId);
  if(admin | req.user.userId==req.params.id){
    usersinfodao.removeUserInfo(req.params.id).then(response=>{
      res.send(response);
      console.log(response);
    }
    ).catch(err=>{
      console.log(err);
      res.send(err);
    })
  }else{
    console.log("Not admin or user with current id403");
    res.sendStatus(403);
  }
});

// does both insert and update, didn't create update to remove boilerplate logic
router.post("/", async(req, res, next)=>{
  // we receive pwd hashed and hash it one more time
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.substring(7,authHeader.length);
  var decoded = jwt.decode(token, {complete: true}).payload;
  let admin = false;
  let userRoles = decoded.roles;
  // console.log(userRoles);
  userRoles.forEach(element => {
      if(element.role_id==1){
          admin = true;
      }
    })
  // console.log(decoded);
  // if id exists then update else insert
  usersinfodao.getUserByLoginId(req.body.login_id)
  .then(result=>{
    if(result[0]){
      if(decoded.userId==req.body.login_id | admin){
        usersinfodao.updateUserInfo(req.body.name, req.body.surname, req.body.position, req.body.phone, req.body.manager_id, req.body.login_id).then(result=>{
        console.log(result);
        res.sendStatus(200);
        }).catch(err=>{
            console.log(err);
            res.sendStatus(500);
          })
      }else{
        console.log("Not same user as trying to update");
        res.sendStatus(403);
      }
    }else{
      usersinfodao.addUserInfo(req.body.name, req.body.surname, req.body.position, req.body.phone, req.body.manager_id, decoded.userId).then(result=>{
          console.log(result);
          res.sendStatus(200);
      }).catch(err=>{
          console.log(err);
          res.sendStatus(500);
      })
    }
  })
  .catch(err=>{
    console.log(err);
    res.sendStatus(500);
  });
  
});

module.exports = router;
