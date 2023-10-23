import { Options } from "../../../Thing";
import Character from "../Character";
import Inventory from "./Inventory";

export default class Player extends Character {
  // inventory = new Inventory(this);

  protected onPopulated(options?: Options): void {
    super.onPopulated(options);
    // super.onPopulated({ ...options, collection: "players" });

    // console.log(JSON.stringify(this.toJSON()));
  }
}
