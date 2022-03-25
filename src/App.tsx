import React from "react";
import { BehaviorSubject, of, Subject } from "rxjs";
import { tap, map, combineLatest, switchMap } from "rxjs/operators";
import "./App.css";
import { Page } from "./components";
import ReactDOM from "react-dom";
import { Store, Tips } from "./types";
import { webSocket } from "rxjs/webSocket";
import * as bus from "./bus";
const websocket$ = webSocket("ws://localhost:8666/ws");

type Op = string;
type Path = string[];
type Value = any;
type Action = [Op, Path, Value];

const assocIn: any = (m: any, [k, ...p]: Path, v: any) => {
  const n = m || {};
  if (p.length === 0) {
    return { ...n, [k]: v };
  }

  return { ...n, [k]: assocIn(n[k], p, v) };
};

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time * 5));

const performActions = (store: Store, actions: Action[]) => {
  let remainingActions = actions;
  let acc = { ...store };
  if (Array.isArray(actions)) {
    while (remainingActions.length != 0) {
      const [action, ...remaining] = remainingActions;
      remainingActions = remaining;
      console.log("ACTION", action);
      const [op, ...args] = action;
      if (op === "assoc-in") {
        const [path, v] = args;
        acc = { ...acc, ...assocIn(acc, path, v) };
      }
      if (op === "show-tips") {
        const tips = {
          ...args[0],
          action: [
            "perform-actions",
            [["assoc-in", ["tips", null]], ...remainingActions],
          ],
        };
        acc = { ...acc, tips: tips as unknown as Tips };
        break;
      }
      if (op === "wait") {
        sleep(args[0] as unknown as number);
      }
    }
  }
  return acc;
};

const store = new BehaviorSubject<Store>({});

const store$ = store.asObservable().pipe(
  combineLatest(websocket$),
  map(([s, ws]) => performActions(s, JSON.parse(ws as string))),

  tap((s) => {
    console.log("STORE", s);
    ReactDOM.render(<Page {...s} />, document.getElementById("root"));
  })
);

bus.watch("me", "perform-actions", (actions: Action[]) => {
  store.next(performActions(store.getValue(), actions));
});

store$.subscribe();

export default <div />;
