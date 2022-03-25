import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { WebsocketBuilder } from "websocket-ts";

const ws = new WebsocketBuilder("ws://localhost:8666/ws")
  .onOpen((i, ev) => {
    console.log("opened");
  })
  .onClose((i, ev) => {
    console.log("closed");
  })
  .onError((i, ev) => {
    console.log("error");
  })
  .onMessage((i, ev) => {
    console.log("message", ev, i);
  })
  .onRetry((i, ev) => {
    console.log("retry");
  })
  .build();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload lol.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
