import Player from "../../living/character/player/Player";
import Item from "../Item";
import Affix from "./affix/Affix";
import Jewellery from "./jewellery/Jewellery";

export default abstract class Equipment extends Item {
  readonly player: Player;

  /** the basic affix section, normally appear in jewelleries */
  protected readonly basicAffixes: Affix[] = [];

  onCreated(): void {
    super.onCreated();

    this.updateAction("use", "穿戴");
  }

  /** attach an affix to the basic affix section of jewelleries */
  attachBasicAffix(affix: Affix) {
    // only allow attach to the same parent equipment
    if (affix.parent != this) return;

    // only allow attach to jewelleries
    if (!(this instanceof Jewellery)) return;

    this.basicAffixes.push(affix);
  }

  /** enable all affixes in this equipment */
  enableAffixes() {
    this.basicAffixes.forEach((affix) => affix.enable());
  }

  /** disable all affixes in this equipment */
  disableAffixes() {
    this.basicAffixes.forEach((affix) => affix.disable());
  }
}
