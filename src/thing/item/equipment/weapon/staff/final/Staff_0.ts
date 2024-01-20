import Thing from "../../../../../Thing";
import { ItemOptions } from "../../../../Item";
import Affix_0 from "../../../affix/final/Affix_0";
import Staff from "../Staff";

export default class Staff_0 extends Staff {
  constructor(parent?: Thing, options?: ItemOptions) {
    super(parent, { name: "学徒法杖", ...options });
  }

  protected onPopulated(options?: ItemOptions): void {
      super.onPopulated(options);

      this.fireDamage.max.inc(5);
      this.fireDamage.min.inc(3);

      new Affix_0(this.magicAffixes);
  }
}
