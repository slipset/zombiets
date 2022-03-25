export type Zombie = {
  id: string;
  kind: number;
  ["max-health"]: number;
};

export type Tips = {
  position: string;
  header: string;
  prose: string;
};

export type Store = {
  zombies?: Record<symbol, Zombie>;
  tips?: Tips;
};
