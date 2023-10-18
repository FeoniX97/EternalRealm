import RangeVal, { RangeValOptions } from "../../value/RangeVal";
import Thing, { Options } from "../../Thing";
import { Delayed } from "colyseus";
import Event from "../../../event/Event";

class ResourceVal extends RangeVal {
  regenPerSec: number = 1;
  regenPercentPerSec: number = 0.0;

  private regenDelayed: Delayed;

  constructor(parent: Resource, options?: RangeValOptions) {
    super(parent, 100, 100, options);
  }

  onRegen = () => {
    this.min.inc(this.regenPerSec + this.max.val() * this.regenPercentPerSec);
  }

  onEventAfter(event: Event): void {
    super.onEventAfter(event);

    if (event.sender == this.min || event.sender == this.max) {
      if (this.min.val() < this.max.val()) {
        // start regen
        if (!this.regenDelayed) {
          this.regenDelayed = this.clock.setInterval(this.onRegen, 1000);
        }
      } else if (this.min.val() >= this.max.val() && this.regenDelayed) {
          this.regenDelayed.clear();
          this.regenDelayed = null;
      }
    }
  }
}

class ESResourceVal extends ResourceVal {
  rechargePercentPerSec: number = .1;

  private rechargeDelayed: Delayed;

  onRecharge = () => {
    this.min.inc(this.max.val() * this.rechargePercentPerSec);
  }

  onEventAfter(event: Event): void {
    super.onEventAfter(event);

    if (event.sender == this.min || event.sender == this.max) {
      if (this.min.val() < this.max.val()) {
        // start recharge
        if (!this.rechargeDelayed) {
          this.rechargeDelayed = this.clock.setInterval(this.onRecharge, 1000);
        }
      } else if (this.min.val() >= this.max.val() && this.rechargeDelayed) {
          this.rechargeDelayed.clear();
          this.rechargeDelayed = null;
      }
    }
  }
}

export default class Resource extends Thing {
  life: ResourceVal;
  mana: ResourceVal;
  es: ESResourceVal;

  constructor(parent: Thing, options?: Options) {
    super(parent, options);

    this.life = new ResourceVal(this, {...options, entityID: 'Life'});
    this.mana = new ResourceVal(this, {...options, entityID: 'Mana'});
    this.es = new ESResourceVal(this, {...options, entityID: 'Es'});
  }
}
