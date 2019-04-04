const app = require('../app')

exports.postMovie = (req, res) => {
  const session = app.driver.session()

  session
    .run(`CREATE (n:Movie {id: ${req.body.imdbID}, name: "${req.body.title}"})`)
    .then(() => {
      res.status(200).send('Successfully added to the list')
    })
    .catch(() => {
      res.status(500).send('Could not add the movie')
    })
    .finally(() => {
      session.close()
    })
}