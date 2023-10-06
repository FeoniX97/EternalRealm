import Living from "../Living";

export default class Character extends Living {
  playerID: string;

  lifeMin: number = 11;
  lifeMax = 100;
}
