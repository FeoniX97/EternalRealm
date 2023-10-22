import Event from "../../event/Event";
import Thing from "../Thing";
import NumVal, { NumChangeEvent, NumValOptions } from "./NumVal";
import Value from "./Value";

export interface RangeValOptions extends NumValOptions {
  min?: number;
  max?: number;
}

export default class RangeVal extends Value {
  min: NumVal;
  max: NumVal;

  constructor(parent: Thing, options?: RangeValOptions) {
    super(parent, options);
  }

  protected onPopulated(options?: RangeValOptions): void {
    super.onPopulated(options);

    let min = options?.json?.min ? options?.json?.min : options?.min ? options?.min : 0;
    this.min = new NumVal(this, { ...options, base: min });
    this.max = new NumVal(this, { ...options, base: options?.json?.max ? options?.json?.max : options?.max ? options?.max : min });

    this.hookEvent(this.min, this.max);
  }

  onEventBefore(event: Event): boolean {
    if (event.sender == this.min) {
      // prevent min from greater than max
      if ((event as NumChangeEvent).to() > this.max.val()) {
        if ((event as NumChangeEvent).sender.getIncreasePercentValue() == 0 && (event as NumChangeEvent).sender.getIncrementPercentValue() == 0) (event as NumChangeEvent).baseTo = this.max.val();
        else (event as NumChangeEvent).limit = this.max.val();
      }
    } else if (event.sender == this.max) {
      // update the limit of the min to new max
      this.min.setLimit((event as NumChangeEvent).to());
    }

    return false;
  }

  toJSON() {
    return {
      min: this.min.toJSON(),
      max: this.max.toJSON(),
    };
  }
}
