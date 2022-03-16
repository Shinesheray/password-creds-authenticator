const mongoose = require("mongoose")
// model for users document
let UsersSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  orgUnit: {
    type: String,
    required: false,
    default: "none",
  },
  division: {
    type: String,
    required: false,
    default: "none",
  },
  role: {
    type: String,
    required: false,
    default: "normal",
  },
})

module.exports = mongoose.model("users", UsersSchema)
