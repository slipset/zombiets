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

export type AssocIn = [Op.ASSOC_IN, string[], any];

export type ShowTips = [Op.SHOW_TIPS, Tips];

export type Wait = [Op.WAIT, number];

export type Unknown = [string, ...any];

export type Action = AssocIn | ShowTips | Wait | Unknown;

export type Player = {
  ["max-health"]: number;
};

export type Store = {
  zombies?: Record<symbol, Zombie>;
  tips?: Tips;
  player?: Player;
};
