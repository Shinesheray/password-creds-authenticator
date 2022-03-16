import fetch from "isomorphic-fetch"
import React, { Component } from "react"
import { Button, Form, Dropdown, DropdownButton } from "react-bootstrap"
import ServerResopnse from "./ServerResopnse"

// Component for updating credential in database
// Access level: managers and admin
class UpdateCredentials extends Component {
  constructor() {
    super()
    this.state = {
      credentialName: "",
      newCredentialName: "",
      login: "",
      password: "",
      orgUnit: "",
      division: "",
      serverResponse: "",
      responseLoaded: null,
    }
    this.onSubmitClick = this.onSubmitClick.bind(this)
  }
  // onsubmit button click, credential data to update is send to backend in body
  onSubmitClick = (e) => {
    e.preventDefault()
    if (
      this.state.credentialName === "" ||
      this.state.newCredentialName === "" ||
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
      fetch("/updatecredentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          JWT: this.props.jwt,
          credentialName: this.state.credentialName,
          newCredentialName: this.state.newCredentialName,
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
    // checks if user role has access to resource before rendering
    if (this.props.role === "normal" || this.props.role === "") {
      return <></>
    }
    return (
      <div style={{ padding: "30px" }}>
        <h2>Update Credentials</h2>
        {/* credential inputs form */}
        {/* credentialName input */}
        <Form.Control
          value={this.state.credentialName}
          style={{ width: "90%", textAlign: "center", margin: "20px" }}
          type="input"
          placeholder="Enter credential name to update"
          onChange={(e) =>
            this.setState({ credentialName: e.target.value.toLowerCase() })
          }
        />
        {/* new credentialName input */}
        <Form.Control
          value={this.state.newCredentialName}
          style={{ width: "90%", textAlign: "center", margin: "20px" }}
          type="input"
          placeholder="Enter new credential name"
          onChange={(e) =>
            this.setState({ newCredentialName: e.target.value.toLowerCase() })
          }
        />
        {/* new login input */}
        <Form.Control
          value={this.state.login}
          style={{ width: "90%", textAlign: "center", margin: "20px" }}
          type="input"
          placeholder="Enter new login username"
          onChange={(e) =>
            this.setState({ login: e.target.value.toLowerCase() })
          }
        />
        {/* new password input */}
        <Form.Control
          value={this.state.password}
          style={{ width: "90%", textAlign: "center", margin: "20px" }}
          type="input"
          placeholder="Enter new login password"
          onChange={(e) =>
            this.setState({ password: e.target.value.toLowerCase() })
          }
        />
        {/* new division input */}
        <Form.Control
          value={this.state.division}
          style={{ width: "90%", textAlign: "center", margin: "20px" }}
          type="input"
          placeholder="Enter new division"
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

export default UpdateCredentials
