import "./App.css"
// local imports
import Login from "./components/Login"

function App() {
  return (
    <div className="App">
      {/* Import React-Bootstrap */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
        integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
        crossOrigin="anonymous"
      />
      <header className="App-header">
        {/* components */}
        <Login />
      </header>
    </div>
  )
}

export default App
