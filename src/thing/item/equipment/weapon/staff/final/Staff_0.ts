import Thing from "../../../../../Thing";
import { WeaponOptions } from "../../Weapon";
import Staff from "../Staff";

export default class Staff_0 extends Staff {
  constructor(parent?: Thing, options?: WeaponOptions) {
    super(parent, { name: "学徒法杖", fireDamageMin: 3, fireDamageMax: 5, ...options });
  }

  protected onPopulated(options?: WeaponOptions): void {
    super.onPopulated(options);

    // console.log(JSON.stringify(options));

    // new Affix_0(this.magicAffixes);
  }
}
