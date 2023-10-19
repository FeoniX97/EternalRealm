import Thing from "../../../../../Thing";
import { ItemOptions } from "../../../../Item";
import Staff from "../Staff";

export default class extends Staff {
  constructor(parent?: Thing, options?: ItemOptions) {
    super("学徒法杖", parent, options);

    this.fireDamage.max.inc(5);
    this.fireDamage.min.inc(3);
  }
}
