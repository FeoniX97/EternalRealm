import { type } from "@colyseus/schema";
import Thing from "../Thing";
import Resource from "./stats/Resource";
import NumVal from "../value/NumVal";
import Core from "./stats/Core";
import Offence from "./stats/Offence";
import Defence from "./stats/Defence";

export default abstract class Living extends Thing {
  @type(NumVal)
  level: NumVal;

  @type(Resource)
  resource: Resource;

  @type(Core)
  core: Core;

  @type(Offence)
  offence: Offence;

  @type(Defence)
  defence: Defence;

  constructor(parent: Thing) {
    super(parent);

    this.level = new NumVal(this, 1);
    this.resource = new Resource(this);
    this.core = new Core(this);
    this.offence = new Offence(this);
    this.defence = new Defence(this);
  }
}
