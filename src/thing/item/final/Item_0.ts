import Rarity from "../../Rarity";
import Thing from "../../Thing";
import Item, { ItemOptions } from "../Item";

export default class extends Item {
  constructor(parent: Thing, options?: ItemOptions) {
    super("神秘礼包", parent, { ...options, rarity: Rarity.unique, desc: "你在路边的石头下面发现这个金光闪闪的包裹，打开说不定有惊喜" });
  }

  protected onUse(payload: any): void {
    console.log("123");
  }
}
