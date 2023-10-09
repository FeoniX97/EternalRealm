import { type } from "@colyseus/schema";
import Event from "../../event/Event";
import NumVal, { NumChangeEvent, NumValOptions } from "./NumVal";
import Value from "./Value";
import Thing from "../Thing";

export default class RangeVal extends Value {
  readonly min: NumVal;
  readonly max: NumVal;

  constructor(
    parent: Thing,
    min: number,
    max?: number,
    options?: NumValOptions
  ) {
    super(parent);

    this.min = new NumVal(this, min, options);
    this.max = new NumVal(this, max ?? min, options);

    this.hookEvent(this.min, this.max);
  }

  onEventBefore(event: Event): boolean {
    if (event.sender == this.min) {
      // prevent min from greater than max
      if ((event as NumChangeEvent).to() > this.max.val()) {
        if (
          (event as NumChangeEvent).sender.getIncreasePercentValue() == 0 &&
          (event as NumChangeEvent).sender.getIncrementPercentValue() == 0
        )
          (event as NumChangeEvent).baseTo = this.max.val();
        else (event as NumChangeEvent).limit = this.max.val();
      }
    } else if (event.sender == this.max) {
      // update the limit of the min to new max
      this.min.setLimit((event as NumChangeEvent).to());
    }

    return false;
  }
}
