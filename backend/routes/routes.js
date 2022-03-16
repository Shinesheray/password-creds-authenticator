const express = require("express")
const route = express.Router()
const Controller = require("../controllers/log.controller.js")
// user login
route.post("/login", Controller.login)
// user registeration
route.post("/register", Controller.register)
// read credential repository
route.post("/findcredentials", Controller.findCredentials)
// add credential data
route.post("/addcredentials", Controller.addCredentials)
// update credential data
route.post("/updatecredentials", Controller.updateCredentials)
// update user data
route.post("/updateusers", Controller.updateUsers)

module.exports = route
