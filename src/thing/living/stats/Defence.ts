import { type } from "@colyseus/schema";
import Thing from "../../Thing";
import NumVal from "../../value/NumVal";

class Resistance extends Thing {
  physical: NumVal;
  fire: NumVal;
  cold: NumVal;
  lightning: NumVal;
  chaos: NumVal;

  constructor(parent: Thing) {
   super(parent);

   this.physical = new NumVal(this);
   this.fire = new NumVal(this);
   this.cold = new NumVal(this);
   this.lightning = new NumVal(this);
   this.chaos = new NumVal(this);
  }
}

export default class Defence extends Thing {
  armour: NumVal;
  evasionRating: NumVal;
  blockRate: NumVal;
  resistance: Resistance

  constructor(parent: Thing) {
   super(parent);

   this.armour = new NumVal(this);
   this.evasionRating = new NumVal(this);
   this.blockRate = new NumVal(this);
   this.resistance = new Resistance(this);
  }
}
