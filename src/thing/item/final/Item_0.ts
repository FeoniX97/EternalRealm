import Rarity from "../../Rarity";
import Thing from "../../Thing";
import Item, { ItemOptions } from "../Item";

export default class Item_0 extends Item {
  constructor(parent: Thing, options?: ItemOptions) {
    super(parent, { name: "神秘礼包", rarity: Rarity.Unique, ...options });
  }

  protected onUse(payload: any): void {
    console.log("123");
  }
}
