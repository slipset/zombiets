import { Topic, Action } from "./types";

type ActionExecutor = (a: Action[]) => void;

type Listener = {
  topic: Topic;
  f: ActionExecutor;
};

const listeners: Record<string, Listener> = {};

export const watch = (id: string, topic: Topic, f: ActionExecutor) =>
  (listeners[id] = { topic, f });

export const publish = ([topic, ...args]: [Topic, Action[]]) => {
  console.log(topic, args);
  Object.values(listeners).forEach((l) => {
    topic === l.topic && l.f.apply(null, args);
  });
};
