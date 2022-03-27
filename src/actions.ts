import { Store, Action, Tips, Path } from "./types";
const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time * 5));

const assocIn: any = (m: any, [k, ...p]: Path, v: any) => {
  const n = m || {};
  if (p.length === 0) {
    return { ...n, [k]: v };
  }
  if (v) {
    return { ...n, [k]: assocIn(n[k], p, v) };
  }
  return { ...n, [k]: null };
};

export const performActions = (store: Store, actions: Action[]) => {
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
