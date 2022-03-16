import React, { Component } from "react"
// This component is called when the server sends a response message to a parent component
export default class ServerResopnse extends Component {
  render() {
    return (
      <div style={{ padding: "30px" }}>
        {/* Renders server response  */}
        <h4 style={{ color: "green" }}>{this.props.srvRes}</h4>
      </div>
    )
  }
}
