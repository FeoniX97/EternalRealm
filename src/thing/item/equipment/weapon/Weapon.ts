import NumVal from "../../../value/NumVal";
import RangeVal from "../../../value/RangeVal";
import Equipment from "../Equipment";

export interface OneHanded {}
export interface TwoHanded {}
export interface OffHanded {}

export interface AttackerWeapon {
  range: NumVal;
}

export interface CasterWeapon {}

export default abstract class Weapon extends Equipment {
  phyDamage: RangeVal;
  fireDamage: RangeVal;
  coldDamage: RangeVal;
  lightningDamage: RangeVal;
  chaosDamage: RangeVal;
  speed: NumVal;
  crtRate: NumVal;

  onCreated(): void {
    super.onCreated();

    this.phyDamage = new RangeVal(this);
    this.fireDamage = new RangeVal(this);
    this.coldDamage = new RangeVal(this);
    this.lightningDamage = new RangeVal(this);
    this.chaosDamage = new RangeVal(this);
    this.speed = new NumVal(this);
    this.crtRate = new NumVal(this);
  }
}
