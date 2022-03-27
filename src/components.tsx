import React from "react";
import { Player, Store, Zombie, Tips } from "./types";
import * as bus from "./bus";

const range = (i: number) => {
  const tmp: number[] = [];
  for (let j = 0; j < i; j++) {
    tmp.push(j);
  }
  return tmp;
};

const ZombieComp = (zombie: Zombie) => (
  <div className="zombie-position">
    <div className={`zombie zombie-${zombie.kind}`}>
      <div className="zombie-health">
        {range(zombie["max-health"]).map((i) => (
          <div key={i} className="heart"></div>
        ))}
      </div>
    </div>
  </div>
);

const TipsComp = ({ position, header, prose, action }: Tips) => (
  <div className="tips" onClick={() => action && bus.publish(action)}>
    <div className={`tips-box ${position}`}>
      <div className="tips-arrow"></div>
      <div className="tips-header">{header}</div>
      <div className="tips-prose">{prose}</div>
    </div>
  </div>
);

const PlayerComp = (player: Player) => (
  <div>
    <div className="player-health">
      {range(player["max-health"]).map((i) => (
        <div key={i} className="heart"></div>
      ))}
    </div>
  </div>
);

export const Page = ({ zombies, tips, player }: Store) => (
  <div className="page">
    <div className="surface">
      <div className="skyline">
        {range(16).map((i) => (
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
