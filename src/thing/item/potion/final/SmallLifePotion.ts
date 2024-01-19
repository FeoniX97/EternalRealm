import Thing from "../../../Thing";
import Potion, { PotionOptions } from "../Potion";

export default class SmallLifePotion extends Potion {
  constructor(parent: Thing, options?: PotionOptions) {
    super(parent, { name: "小型生命药水", desc: "使用后可恢复50点生命值", ...options });
  }

  protected onUse({ self }: { self: SmallLifePotion }): void {
    self.player.resource.life.min.inc(50);
    self.player.resource.es.min.dec(50);
  }
}
