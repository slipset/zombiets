import {
  Store,
  Action,
  Tips,
  Path,
  Op,
  AssocIn,
  Wait,
  ShowTips,
  Topic,
} from "./types";
import * as bus from "./bus";

const sleep = (time: number, remainingActions: Action[]) =>
  setTimeout(() => {
    bus.publish([Topic.PERFORM_ACTION, remainingActions]);
  }, time);

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

const parseAction = ([op, ...args]: [Op, ...any]) => {
  if (op === Op.ASSOC_IN) {
    const [path, v] = args;
    return {
      op,
      path,
      v,
    } as AssocIn;
  }
  if (op === Op.SHOW_TIPS) {
    return {
      op,
      tips: args[0] as unknown as Tips,
    } as ShowTips;
  }
  if (op === Op.WAIT) {
    return {
      op,
      period: args[0] as unknown as number,
    } as Wait;
  }
  console.log("Unknown Action");
};

export const performActions = (store: Store, actions: Action[]) => {
  let remainingActions = actions;
  let acc = { ...store };
  if (Array.isArray(actions)) {
    while (remainingActions.length != 0) {
      const [action, ...remaining] = remainingActions;
      remainingActions = remaining;
      const parsedAction = parseAction(action)!;
      console.log("ACTION", action);
      if (parsedAction.op === Op.ASSOC_IN) {
        acc = { ...acc, ...assocIn(acc, parsedAction.path, parsedAction.v) };
      }
      if (parsedAction.op === Op.SHOW_TIPS) {
        parsedAction.tips.action = [
          Topic.PERFORM_ACTION,
          [[Op.ASSOC_IN, ["tips", null]], ...remainingActions],
        ];
        acc = { ...acc, tips: parsedAction.tips };
        break;
      }
      if (parsedAction.op === Op.WAIT) {
        sleep(parsedAction.period, remainingActions);
        break;
      }
    }
  }
  return acc;
};
