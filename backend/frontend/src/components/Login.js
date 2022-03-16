import fetch from "isomorphic-fetch"
import React, { Component } from "react"
import { Button, Form } from "react-bootstrap"
import ServerResopnse from "./ServerResopnse"
import FindCredentials from "./FindCredentials"
import AddCredentials from "./AddCredentials"
import UpdateCredentials from "./UpdateCredentials"
import UpdateUsers from "./UpdateUsers"

// Component for user login
class Login extends Component {
  constructor() {
    super()
    this.state = {
      username: "",
      password: "",
      serverResponse: "",
      responseLoaded: null,
      jwt: "",
      role: "",
      newlogin: null,
    }
    this.onLoginClick = this.onLoginClick.bind(this)
    this.onRegisterClick = this.onRegisterClick.bind(this)
  }
  // onsubmit button click, username and pasword is send to backend. Upon validation user is granted a jwt
  onLoginClick = (e) => {
    e.preventDefault()
    if (this.state.username === "" || this.state.password === "") {
      this.setState({
        serverResponse: "Enter a username and password",
        responseLoaded: 1,
      })
    } else {
      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          let srvRes = data
          this.setState({
            serverResponse: srvRes.msg,
            jwt: srvRes.token,
            responseLoaded: 1,
            role: srvRes.role,
            newlogin: 1,
          })
        })
    }
  }
// on register button click, username and password is send to backend and new normal user is saved to db.
  onRegisterClick = (e) => {
    e.preventDefault()
    if (this.state.username === "" || this.state.password === "") {
      this.setState({
        serverResponse: "Enter a username and password",
        responseLoaded: 1,
      })
    } else {
      fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          let srvRes = data.msg
          this.setState({
            serverResponse: srvRes,
            responseLoaded: 1,
          })
        })
    }
  }

  render() {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Login</h2>
        {/* document inputs form */}
        {/* username input */}
        <Form.Control
          value={this.state.username}
          style={{ width: "80%", textAlign: "center", margin: "20px" }}
          type="input"
          placeholder="Enter username"
          onChange={(e) =>
            this.setState({ username: e.target.value.toLowerCase() })
          }
        />
        {/* password input */}
        <Form.Control
          value={this.state.password}
          style={{ width: "80%", textAlign: "center", margin: "20px" }}
          type="input"
          placeholder="Enter password"
          onChange={(e) =>
            this.setState({ password: e.target.value.toLowerCase() })
          }
        />
        {/* Login user Button */}
        {/* Triggers onLoginClick*/}
        <Button style={{ margin: "15px" }} onClick={this.onLoginClick}>
          Login
        </Button>{" "}
        or
        {/* Register user Button */}
        {/* Triggers onRegisterClick*/}
        <Button style={{ margin: "15px" }} onClick={this.onRegisterClick}>
          Register new user
        </Button>
        {/* Renders the response from server */}
        {this.state.responseLoaded !== null ? (
          <ServerResopnse srvRes={this.state.serverResponse} />
        ) : null}
        {/* JWT passed to child component */}
        <FindCredentials
          role={this.state.role}
          newlogin={this.state.newlogin}
          jwt={this.state.jwt}
        />
        <AddCredentials role={this.state.role} jwt={this.state.jwt} />
        <UpdateCredentials role={this.state.role} jwt={this.state.jwt} />
        <UpdateUsers role={this.state.role} jwt={this.state.jwt} />
      </div>
    )
  }
}

export default Login
