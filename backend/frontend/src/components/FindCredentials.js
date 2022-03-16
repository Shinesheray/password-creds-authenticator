import fetch from "isomorphic-fetch"
import React, { Component } from "react"
import { Button, Container, Row, Col } from "react-bootstrap"
import "../App.css"
import ServerResopnse from "./ServerResopnse"

// Component for displaying relevant credentials
class FindCredentials extends Component {
  constructor() {
    super()
    this.state = {
      serverResponse: [],
      responseLoaded: null,
      dataLoaded: null,
      items: [],
    }
    this.onSubmitClick = this.onSubmitClick.bind(this)
  }

  // onsubmit button click, req relevant credentials data from backend
  // send jwt to backend
  // backend responds with credentials data
  onSubmitClick = (e) => {
    if (this.props.newlogin === 1) {
      this.setState({
        dataLoaded: null,
      })
    }
    e.preventDefault()
    fetch("/findcredentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        JWT: this.props.jwt,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        let srvRes = data
        this.setState({
          serverResponse: srvRes.msg,
          responseLoaded: 1,
          items: srvRes.data,
        })
        if (Array.isArray(this.state.items) && this.state.items.length) {
          this.setState({
            dataLoaded: 1,
          })
        }
      })
  }

  render() {
    return (
      <div style={{ padding: "30px" }}>
        {/* Submit Button */}
        {/* Triggers onClick*/}
        <Button onClick={this.onSubmitClick}>
          Show my departments credentials
        </Button>
        {/* Renders the response message from server */}
        {this.state.responseLoaded !== null ? (
          <ServerResopnse srvRes={this.state.serverResponse} />
        ) : null}
        {/* Renders the items response from server */}
        {this.state.dataLoaded !== null ? (
          <ul style={{ padding: "10px" }} className="list">
            {this.state.items.map((item, index) => (
              <li key={index} id={index}>
                {" "}
                <Container>
                  <Row>
                    <Col>Name: {item.credentialName} </Col>
                    <Col>Username: {item.login} </Col>
                    <Col>Password: {item.password} </Col>
                  </Row>
                </Container>{" "}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    )
  }
}

export default FindCredentials
