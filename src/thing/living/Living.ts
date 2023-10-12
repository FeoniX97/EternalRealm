import { type } from "@colyseus/schema";
import Thing, { Options } from "../Thing";
import Resource from "./stats/Resource";
import NumVal from "../value/NumVal";
import Core from "./stats/Core";
import Offence from "./stats/Offence";
import Defence from "./stats/Defence";

export default abstract class Living extends Thing {
  level: NumVal;
  resource: Resource;
  core: Core;
  offence: Offence;
  defence: Defence;

  constructor(parent: Thing, options?: Options) {
    super(parent, options);

    this.level = new NumVal(this, 1, { entityID: "Level" });
    this.resource = new Resource(this, options);
    this.core = new Core(this);
    this.offence = new Offence(this);
    this.defence = new Defence(this);
  }
}
