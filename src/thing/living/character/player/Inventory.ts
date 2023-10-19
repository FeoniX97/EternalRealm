import Event from "../../../../event/Event";
import Thing from "../../../Thing";
import Item from "../../../item/Item";
import Equipment, { EquipEvent, UnEquipEvent } from "../../../item/equipment/Equipment";
import Affix_0 from "../../../item/equipment/affix/final/Affix_0";
import BodyArmour from "../../../item/equipment/armour/body_armour/BodyArmour";
import Boots from "../../../item/equipment/armour/boots/Boots";
import Gloves from "../../../item/equipment/armour/gloves/Gloves";
import Helmet from "../../../item/equipment/armour/helmet/Helmet";
import Pants from "../../../item/equipment/armour/pants/Pants";
import Amulet from "../../../item/equipment/jewellery/amulet/Amulet";
import Belt from "../../../item/equipment/jewellery/belt/Belt";
import Ring from "../../../item/equipment/jewellery/ring/Ring";
import Weapon from "../../../item/equipment/weapon/Weapon";
import Staff_0 from "../../../item/equipment/weapon/staff/final/Staff_0";
import Item_0 from "../../../item/final/Item_0";
import SmallLifePotion from "../../../item/potion/SmallLifePotion";
import Player from "./Player";

class Equipped extends Thing {
  mainHand: Weapon;
  offHand: Weapon;
  helmet: Helmet;
  bodyArmour: BodyArmour;
  gloves: Gloves;
  pants: Pants;
  boots: Boots;
  belt: Belt;
  leftRing: Ring;
  rightRing: Ring;
  amulet: Amulet;

  /** equip the equipment, call by inventory */
  equip(equipment: Equipment) {
    if (!equipment || equipment.equipped) return;

    if (equipment instanceof Weapon) {
      if (Weapon.isTwoHanded(equipment)) {
        this.mainHand?.executeAction("unequip");
        this.offHand?.executeAction("unequip");
        this.mainHand = equipment;
      }
    }

    equipment.enableAffixes();
    equipment.disableAction("use");
    equipment.enableAction("unequip");
    equipment.equipped = true;
  }

  /** unequip the equipment, call by inventory */
  unequip(equipment: Equipment) {
    if (!equipment || !equipment.equipped) return;

    switch (equipment) {
      case this.mainHand:
        this.mainHand = null;
        break;
      case this.offHand:
        this.offHand = null;
        break;
      case this.helmet:
        this.helmet = null;
        break;
      case this.bodyArmour:
        this.bodyArmour = null;
        break;
      case this.gloves:
        this.gloves = null;
        break;
      case this.pants:
        this.pants = null;
        break;
      case this.boots:
        this.boots = null;
        break;
      case this.belt:
        this.belt = null;
        break;
      case this.leftRing:
        this.leftRing = null;
        break;
      case this.rightRing:
        this.rightRing = null;
        break;
      case this.amulet:
        this.amulet = null;
        break;
    }

    equipment.disableAffixes();
    equipment.disableAction("unequip");
    equipment.enableAction("use");
    equipment.equipped = false;
  }
}

export default class Inventory extends Thing {
  items: Item[] = [];
  equipped = new Equipped(this);

  constructor(parent: Player) {
    super(parent);

    const potion = new SmallLifePotion(this, { player: parent });
    potion.registerAction("discard", this.discardItem, { label: "丢弃", events: [new InventoryDiscardEvent(this, potion)] });
    this.items.push(potion);

    const staff = new Staff_0(this, { player: parent });
    staff.attachMagicAffix(new Affix_0(staff));
    staff.registerAction("discard", this.discardItem, { label: "丢弃", events: [new InventoryDiscardEvent(this, staff)] });
    this.items.push(staff);

    const surprise = new Item_0(this, { player: parent });
    surprise.registerAction("discard", this.discardItem, { label: "丢弃", events: [new InventoryDiscardEvent(this, surprise)] });
    this.items.push(surprise);
  }

  /** Player.Inventory { action: 'use', index: 0 }\
   *  Player.Inventory { action: 'discard', index: 0 }
   */
  onAction(entities: string, payload: any, onError: (errCode: string, message: string) => void): void {
    if (entities != null) {
      this.passdownAction(entities, payload, onError);
      return;
    }

    const actionID = payload.action;
    const itemIdx = payload.index;
    const item = this.items[itemIdx];

    item.executeAction(actionID, payload, onError);
  }

  /** Player.Inventory { action: 'discard', index: 0 } */
  discardItem = ({ self }: any) => {
    const item = self as Item;

    this.unhookEvent(item);
    item.onDestroy();
    this.items = this.items.filter((_item) => _item != item);
  };

  onEventBefore(event: Event): boolean {
    if (super.onEventBefore(event)) return true;

    if (event instanceof EquipEvent) {
      // equip the equipment
      console.log("equipping equipment ...");
      this.equipped.equip(event.sender);
    } else if (event instanceof UnEquipEvent) {
      // unequip the equipment
      console.log("unequipping equipment ...");
      this.equipped.unequip(event.sender);
    }
  }
}

export class InventoryDiscardEvent extends Event {
  sender: Inventory;
  item: Item;

  constructor(sender: Inventory, item: Item) {
    super(sender);

    this.item = item;
  }
}