const app = require('../app')

exports.postMovie = (req, res) => {
  const session = app.driver.session()

  session
    .run(`MATCH (u:User) WHERE ID(u) = ${req.headers.userid}
    CREATE (:Movie {Title: "${req.body.Title}", Year: ${req.body.Year}, imdbID: "${req.body.imdbID}", 
    Poster: "${req.body.Poster}"}) <-[:RATED {Color: "${req.body.Color}"}]- (u)`)
    .then(() => {
      res.status(200).send({message: 'Successfully added to the list'})
    })
    .catch(() => {
      res.status(500).send({error: 'Could not add the movie'})
    })
    .finally(() => {
      session.close()
    })
}