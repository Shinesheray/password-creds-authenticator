const mongoose = require("mongoose")
const express = require("express")
const Login = require("../models/login.js")
const Credentials = require("../models/credentials.js")
const app = express()
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// user login and verification
exports.login = async (req, res) => {
  let userInDatabase = false
  let users = null
  // login request details from frontend
  const usr = req.body.username
  const pwd = req.body.password
  let enteredUser = { username: usr, password: pwd }
  // fetching existing login details from mongo db 'users' collection
  Login.findOne({ username: usr }, function (err, data) {
    if (err) {
      console.log(err)
      res
        .status(500)
        .send({ msg: "Some error occurred while retrieving login data" })
    } else {
      users = data
      if (
        users.username === enteredUser.username &&
        users.password === enteredUser.password
      ) {
        console.log("Login Successful")
        // creates jwt for user upon successful login and send to frontend
        userInDatabase = true
        payload = {
          username: users.username,
          orgUnit: users.orgUnit,
          division: users.division,
          role: users.role,
        }
        const token = jwt.sign(JSON.stringify(payload), "jwt-secret", {
          algorithm: "HS256",
        })
        res.send({ token: token, msg: "Login successful!", role: users.role })
      } else {
        res.status(403).send({ msg: "Incorrect login info!" })
      }
    }
  })
}

// create new user (registration)
exports.register = async (req, res) => {
  // new user data from frontend
  let loginModel = new Login({
    username: req.body.username,
    password: req.body.password,
  })
  // save to mongo db projects.users collection
  loginModel.save(function (err, data) {
    if (err) {
      console.log(err)
      res
        .status(500)
        .send({ msg: "Some error occurred while creating the user" })
    } else {
      console.log(data)
      res.send({
        msg: "Registration successful",
      })
    }
  })
}

// find credential repository, all registered users with correct permissions
exports.findCredentials = async (req, res) => {
  const token = req.body.JWT
  let credentialsData = []
  // fetch all credentials from db
  Credentials.find({ $orderby: { credentialName: 1 } }, function (err, data) {
    if (err) {
      console.log(err)
      res.status(500).send({
        msg: "Some error occurred while retrieving all credential data",
      })
    } else {
      credentialsData = data
      try {
        let orgUnitArr = []
        let divisionArr = []
        // decode jwt
        const decoded = jwt.verify(token, "jwt-secret")
        // determine what units and divisions the user can access
        for (let i = 0; i < credentialsData.length; i++) {
          if (
            decoded.orgUnit.includes(credentialsData[i].orgUnit) &&
            decoded.division.includes(credentialsData[i].division)
          ) {
            orgUnitArr.push(credentialsData[i].orgUnit)
            divisionArr.push(credentialsData[i].division)
          }
        }
        // if user account has one or more orgUnit and division access, data is found and send to frontend
        if (orgUnitArr.length !== 0 && divisionArr.length !== 0) {
          Credentials.find(
            {
              orgUnit: { $in: orgUnitArr },
              division: { $in: divisionArr },
              $orderby: { credentialName: 1 },
            },
            function (err, data) {
              if (err) {
                console.log(err)
                res
                  .status(500)
                  .send({ msg: "Some error occurred while retrieving data" })
              } else {
                res.send({
                  msg: `Hi, ${decoded.username}. Your access level permits for Organisation Units: ${decoded.orgUnit} Divisions: ${decoded.division} `,
                  data: data,
                })
              }
            }
          )
        } else {
          res.status(403).send({
            msg: "No resources available for this account.",
          })
        }
      } catch (err) {
        res
          .status(401)
          .send({ err: "Bad JWT authorization!", msg: "unauthorized access" })
      }
    }
  })
}

// add new credentials, all registered users
exports.addCredentials = async (req, res) => {
  const token = req.body.JWT
  try {
    const decoded = jwt.verify(token, "jwt-secret")
    // new credential data from frontend
    let credentialsModel = new Credentials({
      credentialName: req.body.credentialName,
      login: req.body.login,
      password: req.body.password,
      orgUnit: req.body.orgUnit,
      division: req.body.division,
    })
    // save to mongo db projects.credentials collection
    credentialsModel.save(function (err, data) {
      if (err) {
        console.log(err)
        res
          .status(500)
          .send({ msg: "Some error occurred while creating credentials" })
      } else {
        console.log(data)
        res.send({
          msg: "Credentials added",
        })
      }
    })
  } catch (err) {
    res
      .status(401)
      .send({ err: "Bad JWT authorization!", msg: "unauthorized access" })
  }
}

//update credentials, managers and admin only
exports.updateCredentials = async (req, res) => {
  const token = req.body.JWT
  try {
    // validates jwt and verifies the user role from the token
    // fetches new credentials and update data from frontend to db
    const decoded = jwt.verify(token, "jwt-secret")
    if (decoded.role === "admin" || decoded.role === "manager") {
      let query = { credentialName: req.body.credentialName }
      Credentials.findOneAndUpdate(
        query,
        {
          $set: {
            credentialName: req.body.newCredentialName,
            login: req.body.login,
            password: req.body.password,
            orgUnit: req.body.orgUnit,
            division: req.body.division,
          },
        },
        function (err, data) {
          if (err) {
            console.log("Something went wrong when updating data.")
          } else {
            res.send({ msg: "Updated Credentials" })
          }
        }
      )
    } else {
      res.status(403).send({
        msg: "account not authorized for access",
      })
    }
  } catch (err) {
    res
      .status(401)
      .send({ err: "Bad JWT authorization!", msg: "unauthorized access" })
  }
}

//update users, admin only
exports.updateUsers = async (req, res) => {
  const token = req.body.JWT
  try {
    // validates jwt and verifies the user role from the token
    // fetches new user permissions from frontend and update to db
    const decoded = jwt.verify(token, "jwt-secret")
    if (decoded.role === "admin") {
      let query = { username: req.body.username }
      Login.findOneAndUpdate(
        query,
        {
          $set: {
            role: req.body.role,
            orgUnit: req.body.orgUnit,
            division: req.body.division,
          },
        },
        function (err, data) {
          if (err) {
            console.log("Something went wrong when updating data.")
          } else {
            res.send({ msg: "Updated User" })
          }
        }
      )
    } else {
      res.status(403).send({
        msg: "account not authorized for access",
      })
    }
  } catch (err) {
    res
      .status(401)
      .send({ err: "Bad JWT authorization!", msg: "unauthorized access" })
  }
}
