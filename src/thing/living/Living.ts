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

    this.level = new NumVal(this, { ...this.parseOptions(options), base: 1, entityID: "level" });
    this.resource = new Resource(this, { ...this.parseOptions(options), entityID: "resource" });
    this.core = new Core(this, { ...this.parseOptions(options), entityID: "core" });
    this.offence = new Offence(this, { ...this.parseOptions(options), entityID: "offence" });
    this.defence = new Defence(this, { ...this.parseOptions(options), entityID: "defence" });
  }
}
