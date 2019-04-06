const app = require('../app')

exports.postMovie = (req, res) => {
  const session = app.driver.session()

  session
    .run(`MERGE (:Movie {Title: "${req.body.Title}", Year: "${req.body.Year}", imdbID: "${req.params.imdbID}", 
    Poster: "${req.body.Poster}"})`)
    .then(() => {
      session
        .run(`MATCH (u:User), (m:Movie {imdbID: "${req.params.imdbID}"}) WHERE ID(u) = ${req.headers.userid} 
        AND NOT (u) -[:RATED]-> (m)
        CREATE (m) <-[:RATED {Color: "${req.body.Color}"}]- (u)`)
        .then(() => {
          res.status(200).send({Info: 'Successfully added to the list'})
        })
        .catch(() => {
          res.status(500).send({Error: 'Could not add to the list'})
        })
        .finally(() => {
          session.close()
        })
    })
    .catch(() => {
      res.status(500).send({Error: 'Could not add to the list'})
    })
}

exports.updateMovie = (req, res) => {
  const session = app.driver.session()

  session
    .run(`MATCH (u:User) -[r:RATED]-> (:Movie {imdbID: "${req.params.imdbID}"}) WHERE ID(u) = ${req.headers.userid}
    SET r.Color = "${req.body.Color}"`)
    .then(() => {
      res.status(200).send({Info: 'Successfully updated rating'})
    })
    .catch(() => {
      res.status(500).send({Error: 'Could not update the rating'})
    })
    .finally(() => {
      session.close()
    })
}

exports.deleteMovie = (req, res) => {
  const session = app.driver.session()

  session
    .run(`MATCH (u:User) -[r:RATED]-> (:Movie {imdbID: "${req.params.imdbID}"}) WHERE ID(u) = ${req.headers.userid} DELETE r`)
    .then(() => {
      session
        .run(`MATCH (m:Movie) WHERE NOT (m) <-- () DELETE m`)
        .then(() => {
          res.status(200).send({Info: 'Successfully deleted rating'})
        })
        .catch(() => {
          res.status(500).send({Error: 'Could not delete the rating'})
        })
        .finally(() => {
          session.close()
        })
    })
    .catch(() => {
      res.status(500).send({Error: 'Could not delete the rating'})
    })
    .finally(() => {
      session.close()
    })
}

exports.getMovies = (req, res) => {
  const session = app.driver.session()

  session
    .run(`MATCH (u:User) -[:RATED]-> (m:Movie) WHERE ID(u) = ${req.headers.userid} RETURN m`)
    .then((result) => {
      res.status(200).send({
        Info: 'Successfully fetched user\'s movies',
        Result: result.records.map(record => record._fields[0].properties),
      })
    })
    .catch(() => {
      res.status(500).send({Error: 'Could not fetch user\'s movies'})
    })
    .finally(() => {
      session.close()
    })
}

exports.getMovie = (req, res) => {
  const session = app.driver.session()

  session
    .run(`MATCH (u:User) -[r:RATED]-> (:Movie {imdbID: "${req.params.imdbID}"}) 
    WHERE ID(u) = ${req.headers.userid} RETURN r.Color`)
    .then((result) => {
      res.status(200).send({
        Info: 'Successfully fetched movie\'s rating',
        Result: result.records.map(record => record._fields[0])[0],
      })
    })
    .catch(() => {
      res.status(500).send({Error: 'Could not fetch movie\'s rating'})
    })
    .finally(() => {
      session.close()
    })
}