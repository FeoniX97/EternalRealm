import Thing from "../../Thing";
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

  constructor(parent: Thing) {
    super(parent);

    this.fire = new RangeVal(this, 1);
    this.cold = new RangeVal(this, 1);
    this.lightning = new RangeVal(this, 1);
    this.chaos = new RangeVal(this, 1);
    this.speed = new NumVal(this, 1.1);
    this.crtRate = new NumVal(this, 0);
  }
}

export class Attack extends Damage {
  physical: RangeVal;

  constructor(parent: Thing) {
    super(parent);

    this.physical = new RangeVal(this, 1);
  }
}

class Spell extends Damage {}

export default class Offence extends Thing {
  attack: Attack;
  spell: Spell;
  accuracyRating: NumVal;
  crtDamage: NumVal;

  constructor(parent: Thing) {
    super(parent);

    this.attack = new Attack(this);
    this.spell = new Spell(this);
    this.accuracyRating = new NumVal(this, 100);
    this.crtDamage = new NumVal(this, fromPercent(100));
  }
}