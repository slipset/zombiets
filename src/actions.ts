import { Store, Action, Path, Op, Topic } from "./types";
import * as bus from "./bus";

const sleep = (period: number, remainingActions: Action[]) =>
  setTimeout(() => {
    bus.publish([Topic.PERFORM_ACTION, remainingActions]);
  }, period);

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
  let acc = { ...store };
  let remainingActions = actions;
  while (remainingActions.length !== 0) {
    const [action, ...remaining] = remainingActions;
    remainingActions = remaining;
    if (action[0] === Op.ASSOC_IN) {
      acc = { ...acc, ...assocIn(acc, action[1], action[2]) };
    }
    if (action[0] === Op.SHOW_TIPS) {
      const tips = {
        ...action[1],
        action: [
          Topic.PERFORM_ACTION,
          [[Op.ASSOC_IN, ["tips"], null], ...remainingActions],
        ],
      };
      acc = { ...acc, tips };
      break;
    }
    if (action[0] === Op.WAIT) {
      sleep(action[1], remainingActions);
      break;
    }
  }

  return acc;
};
