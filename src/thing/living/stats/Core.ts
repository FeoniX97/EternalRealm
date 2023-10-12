import Thing from "../../Thing";
import NumVal, { NumChangeEvent } from "../../value/NumVal";
import Event from "../../../event/Event";
import Living from "../Living";
import { fromPercent } from "../../../utils/utils";

export default class Core extends Thing {
  parent: Living;

  str: NumVal;
  agi: NumVal;
  int: NumVal;
  unallocated: NumVal;

  constructor(parent: Living) {
    super(parent);

    this.str = new NumVal(this, 1, { entityID: "Str" });
    this.agi = new NumVal(this, 1, { entityID: "Agi" });
    this.int = new NumVal(this, 1, { entityID: "Int" });
    this.unallocated = new NumVal(this, 5);
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
    // console.log(
    //   this.entityID
    //     ? this.entityID
    //     : this.constructor.name +
    //         " received action, child entities: " +
    //         entities +
    //         ", payload: " +
    //         JSON.stringify(payload)
    // );

    let target = this.children.find((child) => child.entityID === entities) as NumVal;

    if (payload.action === "inc") {
      if (this.unallocated.base > 0) {
        this.unallocated.dec(1);
        target.inc(1);
      } else {
        onError("test", "可分配属性点不足！");
      }
    } else if (payload.action === "dec" && target.base > 1) {
      target.dec(1);
      this.unallocated.inc(1);
    }
  }
}
