const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const { fireauth } = require('../services/firebase/init')

const AUTH0_DOMAIN = '34fame.us.auth0.com'
const AUTH0_AUDIENCE = 'https://api-dev.ibofk.com'

module.exports = function (app) {
   const jwtCheck = jwt({
      secret: jwks.expressJwtSecret({
         cache: true,
         rateLimit: true,
         jwksRequestsPerMinute: 5,
         jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
      }),
      audience: AUTH0_AUDIENCE,
      issuer: `https://${AUTH0_DOMAIN}/`,
      algorithms: ['RS256'],
   })

   app.get('/auth/token', jwtCheck, (req, res) => {
      const uid = req.user.sub
      fireauth
         .createCustomToken(uid)
         .then((customToken) => res.json({ firebaseToken: customToken }))
         .catch((err) =>
            res.status(500).send({
               message: 'Something went wrong acquiring a Firebase token.',
               error: err,
            })
         )
   })
}
