import { Subject } from "rxjs";
import { scan } from "rxjs/operators";
import { Page } from "./components";
import ReactDOM from "react-dom";
import { performActions } from "./actions";
import { Action, Topic, Store } from "./types";
import { webSocket } from "rxjs/webSocket";
import * as bus from "./bus";

const websocket$ = webSocket("ws://localhost:8666/ws");
const container = document.getElementById("root");

const error = (msg: string) => (e: any) => console.log(`${msg}: ERROR`, e);
const complete = (msg: string) => () => console.log(`${msg}: Completed`);

const render = (s: Store) => ReactDOM.render(<Page {...s} />, container);

const action$ = new Subject<Action[]>();

websocket$.subscribe(
  (event) => {
    const json = JSON.parse(event as string);
    if (Array.isArray(json)) {
      action$.next(json);
    } else {
      action$
        .pipe(scan(performActions, json))
        .subscribe(render, error("STORE"), complete("STORE"));
    }
  },
  error("WS"),
  complete("WS")
);

bus.watch("me", Topic.PERFORM_ACTION, (actions) => action$.next(actions));
