import { type } from "@colyseus/schema";
import Thing from "../../Thing";
import NumVal, { NumChangeEvent } from "../../value/NumVal";
import Event from "../../../event/Event";
import Living from "../Living";
import { fromPercent } from "../../../utils/utils";

export default class Core extends Thing {
  parent: Living;

  @type(NumVal)
  str: NumVal;

  @type(NumVal)
  agi: NumVal;

  @type(NumVal)
  int: NumVal;

  @type(NumVal)
  unallocated: NumVal;

  constructor(parent: Living) {
    super(parent);

    this.str = new NumVal(this, 1);
    this.agi = new NumVal(this, 1);
    this.int = new NumVal(this, 1);
    this.unallocated = new NumVal(this, 5);
  }

  onEventAfter(event: Event): void {
    if (event.sender == this.str) {
      this.parent.resource.life.max.inc((event as NumChangeEvent).diff() * 6);
      this.parent.defence.resistance.physical.inc(
        (event as NumChangeEvent).diff() * fromPercent(0.1)
      );
    }
  }
}
