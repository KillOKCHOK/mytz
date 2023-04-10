var express = require('express');
var router = express.Router();
var  logindao = require('../db/logindao');
var  user_roledao = require('../db/user_roledao');
var sha256 = require('sha256');
const jwt = require("jsonwebtoken");


/**
 * @swagger
 * /login:
 *  post:
 *    description: Login user
 *    parameters:
 *    - name: login
 *      description: User's login/email
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
 *        description : return new user ID
 *      500:
 *        description : Internal Server error
 */
router.post("/", async(req, res, next)=>{
    let { login, password } = req.body;
    let user = {};
    console.log(login);
    logindao.getAccountByLogin(login).then(response=>{
        if(response[0]){
          user = response[0];
          if(sha256(password)==user.password){
            // fetch roles
            user_roledao.getRolesByUserId(user.id).then(roleResp=>{
              res.status(200)
              .json({
                success: true,
                data: {
                  userId: user.id,
                  email: user.login,
                  token: jwt.sign(
                    { 
                      userId: user.id,
                      email: user.login,
                      roles: roleResp,
                      deviceType: req.body.deviceType,
                      browserName: req.body.browserName,
                      platformName: req.body.platformName
                    },
                    process.env.TOKEN_SECRET,
                    { expiresIn: "10h" }
                  )
                },
              });
              console.log(roleResp);
            }).catch(err=>{
              console.log(err);
              res.sendStatus(500);
            })
          }else{
            res.sendStatus(403);
            console.log("Wrong pwd");
          }
        }else{
          res.sendStatus(403);
          console.log("Wrong login");
          console.log(response);
        }
  }).catch(err=>{
    console.log(err);
    res.sendStatus(500);
  })
});

module.exports = router;



