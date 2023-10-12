import Character from "../Character";
import Inventory from "./Inventory";

export default class Player extends Character {
  playerID: string = "Hello";

  inventory = new Inventory(this);
}
