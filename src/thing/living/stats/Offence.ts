import Thing, { Options } from "../../Thing";
import RangeVal from "../../value/RangeVal";
import NumVal from "../../value/NumVal";
import { fromPercent } from "../../../utils/utils";

export abstract class Damage extends Thing {
  fire: RangeVal;
  cold: RangeVal;
  lightning: RangeVal;
  chaos: RangeVal;
  speed: NumVal;
  crtRate: NumVal;

  protected onPopulated(options?: Options): void {
    super.onPopulated(options);

    this.fire = new RangeVal(this, { entityID: "fire", ...options });
    this.cold = new RangeVal(this, { entityID: "cold", ...options });
    this.lightning = new RangeVal(this, { entityID: "lightning", ...options });
    this.chaos = new RangeVal(this, { entityID: "chaos", ...options });
    this.speed = new NumVal(this, { entityID: "speed", ...options });
    this.crtRate = new NumVal(this, { entityID: "crtRate", ...options });
  }
}

export class Attack extends Damage {
  physical: RangeVal;

  protected onPopulated(options?: Options): void {
    super.onPopulated(options);

    this.physical = new RangeVal(this, { min: 1, entityID: "physical", ...options });
  }
}

class Spell extends Damage {}

export default class Offence extends Thing {
  attack: Attack;
  spell: Spell;
  accuracyRating: NumVal;
  crtDamage: NumVal;

  protected onPopulated(options?: Options): void {
    super.onPopulated(options);

    this.attack = new Attack(this, { entityID: "attack", ...options });
    this.spell = new Spell(this, { entityID: "spell", ...options });
    this.accuracyRating = new NumVal(this, { base: 100, entityID: "accuracyRating", ...options });
    this.crtDamage = new NumVal(this, { base: fromPercent(100), entityID: "crtDamage", ...options });
  }
}
