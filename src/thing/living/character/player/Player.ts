import { Log } from "../../../../utils/utils";
import Thing, { Options } from "../../../Thing";
import Character from "../Character";
import Inventory from "./Inventory";

export default class Player extends Character {
  inventory: Inventory;

  constructor(parent?: Thing, options?: Options) {
    super(parent, { ...options, collection: "players" });
  }

  protected onPopulated(options?: Options): void {
    super.onPopulated(options);

    this.inventory = new Inventory(this, { entityID: "inventory", ...options });
  }
}
