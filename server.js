require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIEDEX = require('./moviedex.json')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())


app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    console.log('validate bearer token middleware')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'})
    }
    // move to the next middleware - ESSENTIAL
    next()
  })



function handleGetMovies(req,res) {
    let response = MOVIEDEX

    // filter movies by genre if genre query param is present
        if (req.query.genre) {
            response = response.filter(movie =>
                // case insensitive searching
                movie.genre.toLowerCase()
                .includes(req.query.genre.toLowerCase())   
                )
        }
    // filter movies by country if country query param is present
        if (req.query.country) {
            response = response.filter(movie =>
                // case insensitive searching
                movie.country.toLowerCase()
                .includes(req.query.country.toLowerCase())   
                )
        }
    // filter movies by rating if rating query param is present
        if(req.query.avg_vote) {
            response = response.filter(movie => 
                Number(movie.avg_vote) >= (req.query.avg_vote))
        }

    res.json(response)
}

app.get('/movie', handleGetMovies) 
    
const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost: ${PORT}`)
})
