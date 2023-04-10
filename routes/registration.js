var express = require('express');
var router = express.Router();
var  logindao = require('../db/logindao');
var  user_roledao = require('../db/user_roledao');
var sha256 = require('sha256');

/* GET users listing. */
router.post("/", async(req, res, next)=>{
    // we receive pwd hashed and hash it one more time
    let { email, password } = req.body;
    console.log("email");
    console.log(req.body);
    logindao.createAccount(email, sha256(password)).then(response=>{
        console.log("response");
        console.log(response);
        user_roledao.addUserRole(parseInt(response), 2).then(roleresp=>{
            res.send(JSON.stringify(response));
            console.log("created user with id "+response+ " and role "+roleresp);
        }).catch(err=>{
            console.log(err);
            res.sendStatus(500);
          })
  }).catch(err=>{
    console.log(err);
    res.sendStatus(500);
  })
});

module.exports = router;
