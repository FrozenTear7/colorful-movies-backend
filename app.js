const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const neo4j = require('neo4j-driver').v1
require('dotenv').config()

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

router.route('/findMovies/:s/:y/:page')
    .get(moviesController.findMovies)

router.route('/findMovie/:i')
    .get(moviesController.findMovie)

app.listen(process.env.PORT || 3001)

exports.driver = neo4j.driver(process.env.connection,
    neo4j.auth.basic(process.env.login, process.env.password))
