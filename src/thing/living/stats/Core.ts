import Thing, { Options } from "../../Thing";
import NumVal, { NumChangeEvent } from "../../value/NumVal";
import Event from "../../../event/Event";
import Living from "../Living";
import { fromPercent } from "../../../utils/utils";
import gameConstant from "../../../utils/gameConstant";

export default class Core extends Thing {
  parent: Living;

  str: NumVal;
  agi: NumVal;
  int: NumVal;
  unallocated: NumVal;

  protected onPopulated(options?: Options): void {
    super.onPopulated(options);

    this.str = new NumVal(this, { base: gameConstant.character.living.core.str.default, entityID: "str", ...options });
    this.agi = new NumVal(this, { base: gameConstant.character.living.core.agi.default, entityID: "agi", ...options });
    this.int = new NumVal(this, { base: gameConstant.character.living.core.int.default, entityID: "int", ...options });
    this.unallocated = new NumVal(this, { base: gameConstant.character.living.core.unallocated, entityID: "unallocated", ...options });
  }

  onEventAfter(event: Event): void {
    if (event.sender == this.str) {
      this.parent.resource.life.max.inc((event as NumChangeEvent).diff() * 6);
      this.parent.defence.resistance.physical.inc((event as NumChangeEvent).diff() * fromPercent(0.1));
    } else if (event.sender == this.agi) {
      this.parent.defence.evasionRating.inc((event as NumChangeEvent).diff() * 6);
      this.parent.offence.accuracyRating.inc((event as NumChangeEvent).diff() * 3);
    } else if (event.sender == this.int) {
      this.parent.resource.es.max.increasePercent((event as NumChangeEvent).diff() * fromPercent(1));
      this.parent.resource.mana.max.inc((event as NumChangeEvent).diff() * 3);
    }
  }

  /** Character.Core.Str/Agi/Int { action: inc/dec } */
  onAction(entities: string, payload: any, onError: (errCode: string, message: string) => void): void {
    let target = this.children.find((child) => child.entityID === entities) as NumVal;

    if (payload.action === "inc") {
      if (this.unallocated.base > 0) {
        this.unallocated.dec(1);
        target.inc(1);
      } else {
        onError(null, "可分配属性点不足！");
      }
    } else if (payload.action === "dec" && target.base > 1) {
      target.dec(1);
      this.unallocated.inc(1);
    }
  }
}
