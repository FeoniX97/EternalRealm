import Thing, { Options } from "../../Thing";
import NumVal from "../../value/NumVal";

class Resistance extends Thing {
  physical: NumVal;
  fire: NumVal;
  cold: NumVal;
  lightning: NumVal;
  chaos: NumVal;

  protected onPopulated(options?: Options): void {
    super.onPopulated(options);

    this.physical = new NumVal(this, { entityID: "physical", ...options });
    this.fire = new NumVal(this, { entityID: "fire", ...options });
    this.cold = new NumVal(this, { entityID: "cold", ...options });
    this.lightning = new NumVal(this, { entityID: "lightning", ...options });
    this.chaos = new NumVal(this, { entityID: "chaos", ...options });
  }
}

export default class Defence extends Thing {
  armour: NumVal;
  evasionRating: NumVal;
  blockRate: NumVal;
  resistance: Resistance;

  protected onPopulated(options?: Options): void {
    super.onPopulated(options);

    this.armour = new NumVal(this, { entityID: "armour", ...options });
    this.evasionRating = new NumVal(this, { entityID: "evasionRating", ...options });
    this.blockRate = new NumVal(this, { entityID: "blockRate", ...options });
    this.resistance = new Resistance(this, { entityID: "resistance", ...options });
  }
}
