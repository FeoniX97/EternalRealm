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

    this.level = new NumVal(this, { base: 1, entityID: "level", ...options });
    this.resource = new Resource(this, { entityID: "resource", ...options });
    this.core = new Core(this, { entityID: "core", ...options });
    this.offence = new Offence(this, { entityID: "offence", ...options });
    this.defence = new Defence(this, { entityID: "defence", ...options });
  }
}
