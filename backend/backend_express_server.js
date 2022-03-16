const express = require("express")
const fetch = require("isomorphic-fetch")
const helmet = require("helmet")
const fs = require("fs")
const app = express()
const port = process.env.PORT || 8080
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const Routes = require("../backend/routes/routes.js")
const jwt = require("jsonwebtoken")
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static("public"))
app.use("/", Routes)

//Mongoose connection
const uri =
'<ADD DATABASE LINK TO CLUSTER HERE>'
mongoose.Promise = global.Promise
mongoose.connect(uri, {
  dbName: 'credential_management'
})
mongoose.connection.on("error", function () {
  console.log("Could not connect to the database. Exiting now...")
  process.exit()
})
mongoose.connection.once("open", function () {
  console.log("Successfully connected to the database")
})

//The ​listen() method specifies what port the app object (application server) will listen to HTTP requests on.
app.listen(port, () => console.log(`Listening on port ${port}`))
