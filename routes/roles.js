var express = require('express');
var router = express.Router();
var  logindao = require('../db/logindao');
var  user_roledao = require('../db/user_roledao');
var sha256 = require('sha256');
const jwt = require('jsonwebtoken');

router.post("/", async(req, res, next)=>{
    // we receive pwd hashed and hash it one more time
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split('_')[1];
    var decoded = jwt.decode(token, {complete: true}).payload;
    let admin = false;
    let userRoles = decoded.roles;
    // console.log(userRoles);
    userRoles.forEach(element => {
        if(element.role_id==1){
            admin = true;
        }
    });
    if(admin){
        user_roledao.addUserRole(req.body.user_id,req.body.role_id).then(result=>{
            console.log(result);
            res.sendStatus(200);
        }).catch(err=>{
            console.log(err);
            res.sendStatus(500);
        })
    }else{
        console.log("Not admin 403");
        res.sendStatus(403);
    }
});

router.delete("/", async(req, res, next)=>{
    // we receive pwd hashed and hash it one more time
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split('_')[1];
    var decoded = jwt.decode(token, {complete: true}).payload;
    let admin = false;
    let userRoles = decoded.roles;
    // console.log(userRoles);
    userRoles.forEach(element => {
        if(element.role_id==1){
            admin = true;
        }
    });
    if(admin){
        user_roledao.removeUserRole(req.body.user_id,req.body.role_id).then(result=>{
            console.log(result);
            res.sendStatus(200);
        }).catch(err=>{
            console.log(err);
            res.sendStatus(500);
        })
    }
});

module.exports = router;