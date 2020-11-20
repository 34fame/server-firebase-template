const functions = require('firebase-functions')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(logger('dev'))

require('./routes/auth')(app)

app.use(function (request, response) {
   response.status(404).send()
})

exports.api = functions.https.onRequest(app)
