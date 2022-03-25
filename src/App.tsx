import React from "react";
import { of } from "rxjs";
import { tap, map, combineLatest } from "rxjs/operators";
import "./App.css";
import { Page } from "./components";
import ReactDOM from "react-dom";
import { Store } from "./types";
import { webSocket } from "rxjs/webSocket";

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

const performActions = (store: Store, actions: Action[]) => {
  let newStore = { ...store };
  if (Array.isArray(actions)) {
    actions.forEach((action: Action) => {
      const [op, ...args] = action;
      if (op === "assoc-in") {
        const [path, v] = args;
        newStore = { ...newStore, ...assocIn(store, path, v) };
      }
    });
  }
  return newStore;
};

const store$ = of({})
  .pipe(
    combineLatest(websocket$),
    map(([s, ws]) => performActions(s, JSON.parse(ws as string))),

    tap((s) => {
      ReactDOM.render(<Page {...s} />, document.getElementById("root"));
    })
  )
  .subscribe();

export default <div />;
