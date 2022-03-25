import React from "react";
import { Player, Store, Zombie, Tips } from "./types";
import * as bus from "./bus";

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

const TipsComp = ({ position, header, prose, action }: Tips) => (
  <div className="tips" onClick={() => action && bus.publish(action)}>
    <div className={`tips-box ${position}`}>
      <div className="tips-arrow"></div>
      <div className="tips-header">{header}</div>
      <div className="tips-prose">{prose}</div>
    </div>
  </div>
);

const PlayerComp = (player: Player) => {
  const hearts = [];
  for (var i = 0; i < player["max-health"]; i++) {
    hearts.push(i);
  }

  return (
    <div>
      <div className="player-health">
        {hearts.map((i) => (
          <div key={i} className="heart"></div>
        ))}
      </div>
    </div>
  );
};
export const Page = ({ zombies, tips, player }: Store) => {
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
        {player && <PlayerComp {...player} />}
        {tips && <TipsComp {...tips} />}
      </div>
    </div>
  );
};
