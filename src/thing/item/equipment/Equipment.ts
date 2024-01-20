import Event from "../../../event/Event";
import Player from "../../living/character/player/Player";
import ArrVal from "../../value/ArrVal";
import Item, { ItemOptions } from "../Item";
import Affix from "./affix/Affix";

export default abstract class Equipment extends Item {
  readonly player: Player;

  equipped = false;

  /** the basic affix section, normally appear in jewelleries */
  readonly basicAffixes: Affix[] = [];

  /** the magic affix section */
  magicAffixes: ArrVal<Affix>;

  protected onPopulated(options?: ItemOptions): void {
    super.onPopulated(options);

    this.magicAffixes = new ArrVal(this, {
      entityID: "magicAffixes",
      ...options,
      populate: {
        onPopulated: (arrVal, thing, options) => {
          thing.equipment = this;
        },
      },
    });

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

    this.basicAffixes.push(affix);
  }

  /** attach an affix to the magic affix section */
  // attachMagicAffix(affix: Affix) {
  //   // only allow attach to the same parent equipment
  //   if (affix.parent && affix.parent != this) return;

  //   this.magicAffixes.add(affix);
  // }

  /** enable all affixes in this equipment */
  enableAffixes() {
    this.basicAffixes.forEach((affix) => affix.enable());
    this.magicAffixes.children.forEach((affix) => affix.enable());
  }

  /** disable all affixes in this equipment */
  disableAffixes() {
    this.basicAffixes.forEach((affix) => affix.disable());
    this.magicAffixes.children.forEach((affix) => affix.disable());
  }
}

export class EquipEvent extends Event {
  sender: Equipment;
}

export class UnEquipEvent extends Event {
  sender: Equipment;
}
