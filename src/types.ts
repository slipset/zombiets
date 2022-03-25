
export type Zombie = {
  id: string;
  kind: number;
  ['max-health']: number;
}
export type Store = {
  zombies?: Record<symbol, Zombie>
};
