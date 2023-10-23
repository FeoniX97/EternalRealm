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

  protected onPopulated(options?: Options): void {
    super.onPopulated(options);

    this.level = new NumVal(this, { base: 1, entityID: "level", ...this.parseOptions(options) });
    this.resource = new Resource(this, { entityID: "resource", ...this.parseOptions(options) });
    this.core = new Core(this, { entityID: "core", ...this.parseOptions(options) });
    this.offence = new Offence(this, { entityID: "offence", ...this.parseOptions(options) });
    this.defence = new Defence(this, { entityID: "defence", ...this.parseOptions(options) });
  }
}
