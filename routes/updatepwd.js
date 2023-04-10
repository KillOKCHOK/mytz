var express = require('express');
var router = express.Router();
var  logindao = require('../db/logindao');
var  user_roledao = require('../db/user_roledao');
var sha256 = require('sha256');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * /changepassword:
 *  post:
 *    description: Protected. Update pwd. Authorized user or admin only.
 *    parameters:
 *    - name: email
 *      description: User's email
 *      in: body
 *      required: true
 *      type: string
 *      value: kitty@mail.com
 *    - name: password
 *      description: User's pwd
 *      in: body
 *      required: true
 *      type: string
 *      value: root
 *    responses:
 *      200:
 *        description : OK
 *      500:
 *        description : Internal Server error
 */
router.post("/", async(req, res, next)=>{
    // we receive pwd hashed and hash it one more time
    let { email, password } = req.body;
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
    // console.log("email");
    // console.log(req.body);
    if(admin | req.user.email==email){
        logindao.updatePassword(email, sha256(password)).then(response=>{
                console.log(response);
                res.sendStatus(200);
        }).catch(err=>{
            console.log(err);
            res.sendStatus(500);
        })
    }
    else{
        console.log("Cant change pwd, wrong login");
        res.sendStatus(403);

    }
});

module.exports = router;
