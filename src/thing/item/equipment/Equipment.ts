import Event from "../../../event/Event";
import Player from "../../living/character/player/Player";
import Item from "../Item";
import Affix from "./affix/Affix";

export default abstract class Equipment extends Item {
  readonly player: Player;

  equipped = false;

  /** the basic affix section, normally appear in jewelleries */
  readonly basicAffixes: Affix[] = [];

  /** the magic affix section */
  readonly magicAffixes: Affix[] = [];

  onCreated(): void {
    super.onCreated();

    this.updateAction("use", "穿戴");
    this.addActionEvent("use", new EquipEvent(this));

    this.registerAction("unequip", this.onUnequip, { label: "卸下", events: [new UnEquipEvent(this)], enabled: false });
  }

  protected onUse({ self }: { self: Equipment }): void {
    // no need to do anything here, inventory will help to equip the equipment, by listening to the EquipEvent send by self
  }

  protected onUnequip() {
    // no need to do anything here, inventory will help to unequip the equipment, by listening to the UnEquipEvent send by self
  }

  /** attach an affix to the basic affix section of jewelleries */
  attachBasicAffix(affix: Affix) {
    // only allow attach to the same parent equipment
    if (affix.parent && affix.parent != this) return;

    // only allow attach to jewelleries
    //if (!(this instanceof Jewellery)) return;

    affix.parent = this;
    this.basicAffixes.push(affix);
  }

  /** attach an affix to the magic affix section */
  attachMagicAffix(affix: Affix) {
    // only allow attach to the same parent equipment
    if (affix.parent && affix.parent != this) return;

    affix.parent = this;
    this.magicAffixes.push(affix);
  }

  /** enable all affixes in this equipment */
  enableAffixes() {
    this.basicAffixes.forEach((affix) => affix.enable());
    this.magicAffixes.forEach((affix) => affix.enable());
  }

  /** disable all affixes in this equipment */
  disableAffixes() {
    this.basicAffixes.forEach((affix) => affix.disable());
    this.magicAffixes.forEach((affix) => affix.disable());
  }
}

export class EquipEvent extends Event {
  sender: Equipment;
}

export class UnEquipEvent extends Event {
  sender: Equipment;
}
