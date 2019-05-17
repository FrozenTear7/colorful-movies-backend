const app = require('../app')
const request = require('request')

exports.putMovie = (req, res) => {
    const session = app.driver.session()

    session
        .run(`MERGE (:Movie {Title: "${req.body.Title}", Year: "${req.body.Year}", imdbID: "${req.params.imdbID}", 
    Poster: "${req.body.Poster}"})`)
        .then(() => {
            session
                .run(`MATCH (u:User), (m:Movie {imdbID: "${req.params.imdbID}"}) WHERE ID(u) = ${req.headers.userid} 
        MERGE (m) <-[r:RATED]- (u)
        ON CREATE SET
            r.Colors = [${req.body.Colors.map(color => `"${color}"`)}]
        ON MATCH SET
            r.Colors = [${req.body.Colors.map(color => `"${color}"`)}]`)
                .then(() => {
                    res.status(200).send({Info: 'Successfully added rating'})
                })
                .catch((error) => {
                    console.log(error)
                    res.status(500).send({Error: 'Could not add rating'})
                })
                .finally(() => {
                    session.close()
                })
        })
        .catch(() => {
            res.status(500).send({Error: 'Could not add rating'})
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
                    res.status(200).send({Info: 'Successfully deleted movies'})
                })
                .finally(() => {
                    session.close()
                })
        })
        .catch(() => {
            res.status(500).send({Error: 'Could not delete the rating'})
            session.close()
        })
}

exports.getUserMovies = (req, res) => {
    const session = app.driver.session()

    session
        .run(`MATCH (u:User) -[r:RATED]-> (m:Movie) WHERE ID(u) = ${req.params.userid} RETURN m, r`)
        .then((result) => {
            res.status(200).send({
                Info: 'Successfully fetched user\'s movies',
                Result: result.records.map(record => {
                    return {
                        movie: record._fields[0].properties,
                        ratings: record._fields[1].properties,
                    }
                }),
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
    WHERE ID(u) = ${req.headers.userid} RETURN r.Colors`)
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

exports.putMovie = (req, res) => {
    const session = app.driver.session()

    session
        .run(`MERGE (:Movie {Title: "${req.body.Title}", Year: "${req.body.Year}", imdbID: "${req.params.imdbID}", 
    Poster: "${req.body.Poster}"})`)
        .then(() => {
            session
                .run(`MATCH (u:User), (m:Movie {imdbID: "${req.params.imdbID}"}) WHERE ID(u) = ${req.headers.userid} 
        MERGE (m) <-[r:RATED]- (u)
        ON CREATE SET
            r.Colors = [${req.body.Colors.map(color => `"${color}"`)}]
        ON MATCH SET
            r.Colors = [${req.body.Colors.map(color => `"${color}"`)}]`)
                .then(() => {
                    res.status(200).send({Info: 'Successfully added rating'})
                })
                .catch((error) => {
                    console.log(error)
                    res.status(500).send({Error: 'Could not add rating'})
                })
                .finally(() => {
                    session.close()
                })
        })
        .catch(() => {
            res.status(500).send({Error: 'Could not add rating'})
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
                    res.status(200).send({Info: 'Successfully deleted movies'})
                })
                .finally(() => {
                    session.close()
                })
        })
        .catch(() => {
            res.status(500).send({Error: 'Could not delete the rating'})
            session.close()
        })
}

exports.getUserMovies = (req, res) => {
    const session = app.driver.session()

    session
        .run(`MATCH (u:User) -[r:RATED]-> (m:Movie) WHERE ID(u) = ${req.params.userid} RETURN m, r`)
        .then((result) => {
            res.status(200).send({
                Info: 'Successfully fetched user\'s movies',
                Result: result.records.map(record => {
                    return {
                        movie: record._fields[0].properties,
                        ratings: record._fields[1].properties,
                    }
                }),
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
    WHERE ID(u) = ${req.headers.userid} RETURN r.Colors`)
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

exports.findMovies = (req, res) => {
    let uri = `http://www.omdbapi.com/?apikey=${process.env.omdb_api_key}&s=${req.params.s}&page=${req.params.page}`
    if (req.params.y !== '-1')
        uri += `&y=${req.params.y}`

    request({
        uri: uri,
        method: 'GET',
    }, (err, movieRes, body) => {
        res.status(200).send(body)
    })
}

exports.findMovie = (req, res) => {
    request({
        uri: `http://www.omdbapi.com/?apikey=${process.env.omdb_api_key}&i=${req.params.i}&plot=full`,
        method: 'GET',
    }, (err, movieRes, body) => {
        res.status(200).send(body)
    })
}