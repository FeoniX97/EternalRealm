import Thing from "../../../../Thing";
import { ItemOptions } from "../../../Item";
import Weapon, { CasterWeapon, TwoHanded } from "../Weapon";

export default abstract class Staff extends Weapon implements TwoHanded, CasterWeapon {
  isTwoHanded: boolean;
  isCasterWeapon: boolean = true;

  constructor(parent: Thing, options?: ItemOptions) {
    super(parent, { type: "法杖", ...options });
  }
}
