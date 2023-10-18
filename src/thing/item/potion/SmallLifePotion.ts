import Thing from "../../Thing";
import Potion, { PotionOptions } from "./Potion";

export default class SmallLifePotion extends Potion {
  constructor(parent: Thing, options?: PotionOptions) {
    super("小型生命药水", parent, { ...options, desc: "使用后可恢复50点生命值" });
  }

  protected onUse({ self }: { self: SmallLifePotion }): void {
    self.player.resource.life.min.inc(50);
    self.player.resource.es.min.dec(50);
  }
}
