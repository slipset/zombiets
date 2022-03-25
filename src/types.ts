export type Zombie = {
  id: string;
  kind: number;
  ["max-health"]: number;
};

export type Tips = {
  position: string;
  header: string;
  prose: string;
  action: any[];
};

export type Player = {
  ["max-health"]: number;
};

export type Store = {
  zombies?: Record<symbol, Zombie>;
  tips?: Tips;
  player?: Player;
};
