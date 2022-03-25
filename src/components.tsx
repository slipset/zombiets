import React from "react";
import { Store, Zombie } from "./types";

const ZombieComp = (zombie: Zombie) => {
  const { kind } = zombie;
  const hearts = [];
  for (var i = 0; i < zombie["max-health"]; i++) {
    hearts.push(i);
  }
  return (
    <div className="zombie-position">
      <div className={`zombie zombie-${kind}`}>
        <div className="zombie-health">
          {hearts.map((i) => (
            <div key={i} className="heart"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Page = ({ zombies }: Store) => {
  const buildings = [];
  for (var i = 0; i < 16; i++) {
    buildings.push(i);
  }

  return (
    <div className="page">
      <div className="surface">
        <div className="skyline">
          {buildings.map((i) => (
            <div key={i} className={`building building-${i}`}></div>
          ))}
        </div>
        <div className="zombies">
          {zombies &&
            Object.values(zombies).map((zombie, i) => (
              <ZombieComp key={i} {...(zombie as unknown as Zombie)} />
            ))}
        </div>
      </div>
    </div>
  );
};
