import fetch from "isomorphic-fetch"
import React, { Component } from "react"
import { Button, Form, Dropdown, DropdownButton } from "react-bootstrap"
import ServerResopnse from "./ServerResopnse"

// Component for updating users in database
// Access level: admin
class UpdateUsers extends Component {
  constructor() {
    super()
    this.state = {
      username: "",
      orgUnit: "",
      division: "",
      role: "",
      serverResponse: "",
      responseLoaded: null,
    }
    this.onSubmitClick = this.onSubmitClick.bind(this)
  }
  // onsubmit button click, user data to update is send to backend in body
  onSubmitClick = (e) => {
    e.preventDefault()
    if (
      this.state.username === "" ||
      this.state.orgUnit === "" ||
      this.state.division === "" ||
      this.state.role === ""
    ) {
      this.setState({
        serverResponse: "no empty inputs allowed",
        responseLoaded: 1,
      })
    } else {
      fetch("/updateusers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          JWT: this.props.jwt,
          username: this.state.username,
          role: this.state.role,
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
    if (this.props.role !== "admin") {
      return <></>
    }
    return (
      <div style={{ padding: "30px" }}>
        <h2>Update User data</h2>
        {/* user info inputs form */}
        {/* username input */}
        <Form.Control
          value={this.state.username}
          style={{ width: "90%", textAlign: "center", margin: "20px" }}
          type="input"
          placeholder="Enter username to update"
          onChange={(e) =>
            this.setState({ username: e.target.value.toLowerCase() })
          }
        />
        {/* Select role dropdown*/}
        <DropdownButton
          title="Assign role"
          style={{ padding: "15px" }}
          onSelect={(e) => this.setState({ role: e })}
        >
          <Dropdown.Item eventKey="normal">normal</Dropdown.Item>
          <Dropdown.Item eventKey="manager">manager</Dropdown.Item>
          <Dropdown.Item eventKey="admin">admin</Dropdown.Item>
        </DropdownButton>

        {/* Assign(reset) orgUnit dropdown*/}
        <DropdownButton
          title="Assign(reset) organisation unit"
          style={{ padding: "15px" }}
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

        {/* Add additional orgUnit dropdown*/}
        <DropdownButton
          title="Select to add additional organisation units"
          style={{ padding: "15px" }}
          onSelect={(e) => {
            let concat = `${this.state.orgUnit} ${e}`
            this.setState({ orgUnit: concat })
          }}
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

        {/* new division input */}
        <Form.Control
          value={this.state.division}
          style={{ width: "90%", textAlign: "center", margin: "20px" }}
          type="input"
          placeholder="Enter division(s)"
          onChange={(e) =>
            this.setState({ division: e.target.value.toLowerCase() })
          }
        />
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

export default UpdateUsers
