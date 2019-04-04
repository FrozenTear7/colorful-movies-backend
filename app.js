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

router.route('/movies')
  .post(moviesController.postMovie)

app.listen(3001, () => {
  console.log('Server running')
})

exports.driver = neo4j.driver(config.db.connection, neo4j.auth.basic(config.db.login, config.db.password))