import React from "react";
import { Subject } from "rxjs";
import { scan } from "rxjs/operators";
import "./App.css";
import { Page } from "./components";
import ReactDOM from "react-dom";
import { performActions } from "./actions";
import { Action } from "./types";
import { webSocket } from "rxjs/webSocket";
import * as bus from "./bus";

const websocket$ = webSocket("ws://localhost:8666/ws");

const action$ = new Subject<Action[]>();

websocket$.subscribe(
  (event) => {
    action$.next(JSON.parse(event as string));
  },
  (e) => {
    console.log("WS error", e);
  },
  () => {
    console.log("WS complete");
  }
);

const store$ = action$.pipe(scan(performActions, {}));

bus.watch("me", "perform-actions", (actions: Action[]) => {
  action$.next(actions);
});

store$.subscribe(
  (s) => {
    ReactDOM.render(<Page {...s} />, document.getElementById("root"));
  },
  (e) => {
    console.log("ERROR", e);
  },
  () => {
    console.log("completed");
  }
);

export default <div />;
