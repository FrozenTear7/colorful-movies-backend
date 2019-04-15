const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const neo4j = require('neo4j-driver').v1

const config = require('./config')

const moviesController = require('./controllers/moviesController')

const app = express()
const router = express.Router()

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({extended: false})

app.use(jsonParser)
app.use(urlencodedParser)
app.use(cors())

app.use(router)

router.route('/users/:userid')
  .get(moviesController.getUserMovies)

router.route('/movies/:imdbID')
  .get(moviesController.getMovie)
  .put(moviesController.putMovie)
  .delete(moviesController.deleteMovie)

app.listen(process.env.PORT || 3001)

exports.driver = neo4j.driver(process.env.connection || config.db.connection,
  neo4j.auth.basic(process.env.login || config.db.login, process.env.password || config.db.password))
