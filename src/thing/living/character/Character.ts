import Living from "../Living";

export default class Character extends Living {
  playerID: string;

  lifeMin: number;
  lifeMax = 100;
}
