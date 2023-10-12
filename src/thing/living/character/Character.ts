import Living from "../Living";
import RangeVal from "../../value/RangeVal";
import Thing, { Options } from "../../Thing";
import Event from "../../../event/Event";
import SmallLifePotion from "../../item/potion/SmallLifePotion";

export default class Character extends Living {
  exp: RangeVal;

  constructor(parent?: Thing, options?: Options) {
    super(parent, options);

    this.exp = new RangeVal(this, 100, 100);
  }

  onEventAfter(event: Event): void {
    super.onEventAfter(event);

    // level up
    if (
      event.sender == this.exp.min &&
      this.exp.min.val() == this.exp.max.val()
    ) {
      this.unhookEvent(this.exp.min);
      this.exp.min.val(0);
      this.hookEvent(this.exp.min);
      this.exp.max.increasePercent(0.2);
      this.level.inc(1);
    }
  }

}
