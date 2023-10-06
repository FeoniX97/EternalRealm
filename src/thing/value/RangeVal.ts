import Event from "../../event/Event";
import NumVal, { NumChangeEvent, NumValOptions } from "./NumVal";
import Value from "./Value";

export default class RangeVal extends Value {
  readonly min: NumVal;
  readonly max: NumVal;

  constructor(min: number, max?: number, options?: NumValOptions) {
    super();

    this.min = new NumVal(min, options);
    this.max = new NumVal(max ?? min, options);

    this.hookEvent(this.min, this.max);
  }

  onEventBefore(event: Event): boolean {
    if (event.sender == this.min) {
      // prevent min from greater than max
      if ((event as NumChangeEvent).to() > this.max.val()) {
        (event as NumChangeEvent).sender.setLimit(this.max.val());
      }
    } else if (event.sender == this.max) {
      // update the limit of the min to new max
      this.min.setLimit((event as NumChangeEvent).to());
    }

    return false;
  }
}
