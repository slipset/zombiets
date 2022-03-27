type Listener = {
  topic: string;
  f: (...a: any[]) => void;
};

const listeners: Record<string, Listener> = {};

export const publish = ([topic, ...args]: any) => {
  console.log(topic, args);
  Object.values(listeners).forEach((l) => {
    topic === l.topic && l.f.apply(null, args);
  });
};

export const watch = (id: string, topic: string, f: (...a: any[]) => void) =>
  (listeners[id] = { topic, f });
