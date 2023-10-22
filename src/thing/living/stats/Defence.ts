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

    this.physical = new NumVal(this, { entityID: "physical", ...this.parseOptions(options) });
    this.fire = new NumVal(this, { entityID: "fire", ...this.parseOptions(options) });
    this.cold = new NumVal(this, { entityID: "cold", ...this.parseOptions(options) });
    this.lightning = new NumVal(this, { entityID: "lightning", ...this.parseOptions(options) });
    this.chaos = new NumVal(this, { entityID: "chaos", ...this.parseOptions(options) });
  }
}

export default class Defence extends Thing {
  armour: NumVal;
  evasionRating: NumVal;
  blockRate: NumVal;
  resistance: Resistance;

  protected onPopulated(options?: Options): void {
    super.onPopulated(options);

    this.armour = new NumVal(this, { entityID: "armour", ...this.parseOptions(options) });
    this.evasionRating = new NumVal(this, { entityID: "evasionRating", ...this.parseOptions(options) });
    this.blockRate = new NumVal(this, { entityID: "blockRate", ...this.parseOptions(options) });
    this.resistance = new Resistance(this, { entityID: "resistance", ...this.parseOptions(options) });
  }
}
