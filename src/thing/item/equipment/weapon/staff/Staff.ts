import Thing from "../../../../Thing";
import Weapon, { CasterWeapon, TwoHanded, WeaponOptions } from "../Weapon";

export default abstract class Staff extends Weapon implements TwoHanded, CasterWeapon {
  isTwoHanded: boolean;
  isCasterWeapon: boolean = true;

  constructor(parent: Thing, options?: WeaponOptions) {
    super(parent, { type: "法杖", ...options });
  }
}
