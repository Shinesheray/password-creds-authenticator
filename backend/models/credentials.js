const mongoose = require("mongoose")
// model for Credentials document
let CredentialsSchema = mongoose.Schema({
  credentialName: {
    type: String,
    required: true,
  },
  login: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  orgUnit: {
    type: String,
    required: true,
  },
  division: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model("credentials", CredentialsSchema)
