const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const neo4j = require('neo4j-driver').v1
const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')

// const config = require('./config')

const moviesController = require('./controllers/moviesController')

const app = express()
const router = express.Router()

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({extended: false})

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.login || config.auth0.domain}.well-known/jwks.json`,
  }),

  audience: process.env.client_id || config.auth0.client_id,
  issuer: process.env.domain || config.auth0.domain,
  algorithms: ['RS256'],
})

app.use(jsonParser)
app.use(urlencodedParser)
app.use(cors())

app.use(router)

router.route('/users/:userid')
  .get(moviesController.getUserMovies)

router.route('/movies/:imdbID')
  .get(checkJwt, moviesController.getMovie)
  .put(checkJwt, moviesController.putMovie)
  .delete(checkJwt, moviesController.deleteMovie)

app.listen(process.env.PORT || 3001)

exports.driver = neo4j.driver(process.env.connection || config.db.connection,
  neo4j.auth.basic(process.env.login || config.db.login, process.env.password || config.db.password))
