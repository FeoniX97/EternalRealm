import RangeVal, { RangeValOptions } from "../../value/RangeVal";
import Thing, { Options } from "../../Thing";
import { Delayed } from "colyseus";
import Event from "../../../event/Event";

class ResourceVal extends RangeVal {
  regenPerSec: number = 1;
  regenPercentPerSec: number = 0.0;

  private regenDelayed: Delayed;

  protected onPopulated(options?: Options): void {
    super.onPopulated({ ...options, min: 100 });
  }

  onRegen() {
    this.min.inc(this.regenPerSec + this.max.val() * this.regenPercentPerSec);
  }

  onEventAfter(event: Event): void {
    super.onEventAfter(event);

    if (event.sender == this.min || event.sender == this.max) {
      if (this.min.val() < this.max.val() && !this.regenDelayed) {
        // start regen
        this.regenDelayed = this.clock.setInterval(() => {
          this.onRegen();
        }, 1000);
      } else if (this.min.val() >= this.max.val() && this.regenDelayed) {
        this.regenDelayed.clear();
        this.regenDelayed = null;
      }
    }
  }
}

class ESResourceVal extends ResourceVal {
  rechargePercentPerSec: number = 0.1;

  private rechargeDelayed: Delayed;

  onRecharge = () => {
    this.min.inc(this.max.val() * this.rechargePercentPerSec);
  };

  onEventAfter(event: Event): void {
    super.onEventAfter(event);

    if (event.sender == this.min || (event.sender == this.max && !this.rechargeDelayed)) {
      if (this.min.val() < this.max.val()) {
        // start recharge
        this.rechargeDelayed = this.clock.setInterval(() => {
          this.onRecharge();
        }, 1000);
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

  protected onPopulated(options?: Options): void {
    super.onPopulated(options);

    this.life = new ResourceVal(this, { entityID: "life", ...this.parseOptions(options) });
    this.mana = new ResourceVal(this, { entityID: "mana", ...this.parseOptions(options) });
    this.es = new ESResourceVal(this, { entityID: "es", ...this.parseOptions(options) });
  }
}
