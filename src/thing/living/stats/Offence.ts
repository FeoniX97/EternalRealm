import { type } from "@colyseus/schema";
import Thing from "../../Thing";
import RangeVal from "../../value/RangeVal";
import NumVal from "../../value/NumVal";
import { fromPercent } from "../../../utils/utils";

abstract class Damage extends Thing {
  @type(RangeVal)
  fire: RangeVal;

  @type(RangeVal)
  cold: RangeVal;

  @type(RangeVal)
  lightning: RangeVal;

  @type(RangeVal)
  chaos: RangeVal;

  @type(NumVal)
  speed: NumVal;

  @type(NumVal)
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

class Attack extends Damage {}
class Spell extends Damage {}

export default class Offence extends Thing {
  @type(Attack)
  attack: Attack;

  @type(Spell)
  spell: Spell;

  @type(NumVal)
  accuracyRating: NumVal;

  @type(NumVal)
  crtDamage: NumVal;

  constructor(parent: Thing) {
    super(parent);

    this.attack = new Attack(this);
    this.spell = new Spell(this);
    this.accuracyRating = new NumVal(this, 100);
    this.crtDamage = new NumVal(this, fromPercent(100));
  }
}
