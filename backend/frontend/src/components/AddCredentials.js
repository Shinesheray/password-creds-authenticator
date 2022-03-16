import fetch from "isomorphic-fetch"
import React, { Component } from "react"
import { Button, Form, Dropdown, DropdownButton } from "react-bootstrap"
import ServerResopnse from "./ServerResopnse"

// Component for adding new credential to database
// Access level: all registered users
class AddCredentials extends Component {
  constructor() {
    super()
    this.state = {
      credentialName: "",
      login: "",
      password: "",
      orgUnit: "",
      division: "",
      serverResponse: "",
      responseLoaded: null,
    }
    this.onSubmitClick = this.onSubmitClick.bind(this)
  }
  // onsubmit button click, new credential data from input fields is send to backend in body
  onSubmitClick = (e) => {
    e.preventDefault()
    if (
      this.state.credentialName === "" ||
      this.state.login === "" ||
      this.state.password === "" ||
      this.state.orgUnit === "" ||
      this.state.division === ""
    ) {
      this.setState({
        serverResponse: "no empty inputs allowed",
        responseLoaded: 1,
      })
    } else {
      fetch("/addcredentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          JWT: this.props.jwt,
          credentialName: this.state.credentialName,
          login: this.state.login,
          password: this.state.password,
          orgUnit: this.state.orgUnit,
          division: this.state.division,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          let srvRes = data
          this.setState({
            serverResponse: srvRes.msg,
            responseLoaded: 1,
          })
        })
    }
  }

  render() {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Add new Credentials</h2>
        {/* credential inputs form */}
        {/* credentialName input */}
        <Form.Control
          value={this.state.credentialName}
          style={{ width: "80%", textAlign: "center", margin: "20px" }}
          type="input"
          placeholder="Enter credential name"
          onChange={(e) =>
            this.setState({ credentialName: e.target.value.toLowerCase() })
          }
        />
        {/* login input */}
        <Form.Control
          value={this.state.login}
          style={{ width: "80%", textAlign: "center", margin: "20px" }}
          type="input"
          placeholder="Enter login username"
          onChange={(e) =>
            this.setState({ login: e.target.value.toLowerCase() })
          }
        />
        {/* password input */}
        <Form.Control
          value={this.state.password}
          style={{ width: "80%", textAlign: "center", margin: "20px" }}
          type="input"
          placeholder="Enter login password"
          onChange={(e) =>
            this.setState({ password: e.target.value.toLowerCase() })
          }
        />
        {/* division input */}
        <Form.Control
          value={this.state.division}
          style={{ width: "80%", textAlign: "center", margin: "20px" }}
          type="input"
          placeholder="Enter division"
          onChange={(e) =>
            this.setState({ division: e.target.value.toLowerCase() })
          }
        />
        {/* Assign orgUnit dropdown*/}
        <DropdownButton
          title="Assign organisation unit"
          style={{ padding: "20px" }}
          onSelect={(e) => this.setState({ orgUnit: e })}
        >
          <Dropdown.Item eventKey="news management">
            news management
          </Dropdown.Item>
          <Dropdown.Item eventKey="software reviews">
            software reviews
          </Dropdown.Item>
          <Dropdown.Item eventKey="hardware reviews">
            hardware reviews
          </Dropdown.Item>
          <Dropdown.Item eventKey="opinion publishing">
            opinion publishing
          </Dropdown.Item>
        </DropdownButton>

        {/* Submit Button */}
        {/* Triggers onClick*/}
        <Button onClick={this.onSubmitClick}>Submit</Button>
        {/* Renders the response from server */}
        {this.state.responseLoaded !== null ? (
          <ServerResopnse srvRes={this.state.serverResponse} />
        ) : null}
      </div>
    )
  }
}

export default AddCredentials
