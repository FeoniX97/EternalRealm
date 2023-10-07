import { type } from "@colyseus/schema";
import RangeVal from "../../value/RangeVal";
import Thing from "../../Thing";

export default class Resource extends Thing {
  @type(RangeVal)
  life: RangeVal;

  @type(RangeVal)
  mana: RangeVal;

  @type(RangeVal)
  es: RangeVal;

  constructor(parent: Thing) {
    super(parent);

    this.life = new RangeVal(this, 100);
    this.mana = new RangeVal(this, 100);
    this.es = new RangeVal(this, 100);
  }
}
