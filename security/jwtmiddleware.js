// https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs  lesson

 
//authorization header sample
//authorization : Bearer_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ3LCJlbWFpbCI6InN0ZXBhbnR5dHNleWtvQGdtYWlsLmNvbS5jb20iLCJkZXZpY2VUeXBlIjoiZGVza3RvcCIsImJyb3dzZXJOYW1lIjoiQ2hyb21lIiwicGxhdGZvcm1OYW1lIjoiV2luZG93cyAxMCBob21lIGVkaXRpb24iLCJpYXQiOjE2NjY4ODU4MjIsImV4cCI6MTY2Njg4OTQyMn0.B9bQPVhDbhnyRoilillFPvgelp7L2qLkdohwpgfqE6M



const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.substring(7,authHeader.length)
  
    if (token == null) {
      return res.sendStatus(401);
      console.log(token)
    }
    
    else jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}

module.exports = authenticateToken;