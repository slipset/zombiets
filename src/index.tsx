import { Subject } from "rxjs";
import { scan } from "rxjs/operators";
import { Page } from "./components";
import ReactDOM from "react-dom";
import { performActions } from "./actions";
import { Action, Topic } from "./types";
import { webSocket } from "rxjs/webSocket";
import * as bus from "./bus";

const websocket$ = webSocket("ws://localhost:8666/ws");

const action$ = new Subject<Action[]>();
const error = (msg: string) => (e: any) => console.log(`${msg}: ERROR`, e);
const complete = (msg: string) => () => console.log(`${msg}: Completed`);

websocket$.subscribe(
  (event) => {
    const json = JSON.parse(event as string);
    if (Array.isArray(json)) {
      action$.next(json);
    }
  },
  error("WS"),
  complete("WS")
);

const store$ = action$.pipe(scan(performActions, {}));

bus.watch("me", Topic.PERFORM_ACTION, (actions) => {
  action$.next(actions);
});

store$.subscribe(
  (s) => {
    ReactDOM.render(<Page {...s} />, document.getElementById("root"));
  },
  error("STORE"),
  complete("STORE")
);
