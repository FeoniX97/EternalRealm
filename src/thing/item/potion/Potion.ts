import Event from "../../../event/Event";
import Thing from "../../Thing";
import RangeVal from "../../value/RangeVal";
import Item, { ItemOptions, ItemUseEvent } from "../Item";

export interface PotionOptions extends ItemOptions {
  maxCharge?: number;
}

export default abstract class Potion extends Item {
  charges: RangeVal;

  constructor(parent: Thing, options?: PotionOptions) {
    super(parent, options);
  }

  protected onPopulated(options?: PotionOptions): void {
    super.onPopulated({ type: "药水", ...options });

    this.charges = new RangeVal(this, { min: 5, entityID: "charges", ...this.parseOptions(options) });
  }

  getCustomDesc(): string[] {
    return [...super.getCustomDesc(), `充能 ${this.charges.min.base}/${this.charges.max.val()}`];
  }

  onEventBefore(event: Event): boolean {
    if (super.onEventBefore(event)) return true;

    // ensure charges are sufficient
    if (event.sender == this && event instanceof ItemUseEvent) {
      if (this.charges.min.base <= 0) {
        event.blocked = true;
        event.errMessage = "potion charges insufficient to use item: " + this.name;
      }
    }
  }

  onEventAfter(event: Event): void {
    super.onEventAfter(event);

    // reduce charges by 1
    if (event.sender == this && event instanceof ItemUseEvent) {
      this.charges.min.dec(1);
    }
  }
}
