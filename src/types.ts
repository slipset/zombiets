export enum Op {
  ASSOC_IN = "assoc-in",
  SHOW_TIPS = "show-tips",
  WAIT = "wait",
  UNKNOWN = "unknown",
}

export enum Topic {
  PERFORM_ACTION = "perform-action",
}

export type Path = string[];

export type Action = [Op, ...any];

export type Zombie = {
  id: string;
  kind: number;
  ["max-health"]: number;
};

export type Tips = {
  position: string;
  header: string;
  prose: string;
  action: [Topic, Action[]];
};

export type AssocIn = {
  op: Op.ASSOC_IN;
  path: string[];
  v: any;
};

export type ShowTips = {
  op: Op.SHOW_TIPS;
  tips: Tips;
};

export type Wait = {
  op: Op.WAIT;
  period: number;
};

export type Unknown = {
  op: Op.UNKNOWN;
  args: any;
};

export type ParsedAction = AssocIn | ShowTips | Wait | undefined;

export type Player = {
  ["max-health"]: number;
};

export type Store = {
  zombies?: Record<symbol, Zombie>;
  tips?: Tips;
  player?: Player;
};
