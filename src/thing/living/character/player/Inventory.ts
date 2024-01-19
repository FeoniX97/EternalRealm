import Event from "../../../../event/Event";
import { Log } from "../../../../utils/utils";
import Thing, { Options } from "../../../Thing";
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
import ArrVal from "../../../value/ArrVal";
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
  parent: Player;

  items: ArrVal<Item>;
  // equipped = new Equipped(this);

  protected onPopulated(options?: Options): void {
    super.onPopulated(options);

    this.items = new ArrVal(this, {
      entityID: "items",
      populate: {
        // we dont populate default Things, so no need 'onPopulate'
        // onPopulate: (arrVal, options) => {
        //   return new Item_0(arrVal, {
        //     player: this.parent,
        //     ...options,
        //   });
        // },
        onPopulated: (arrVal, thing, options) => {
          thing.player = this.parent;
          thing.registerAction("discard", this.discardItem, { label: "丢弃", events: [new InventoryDiscardEvent(this, thing)] });
        },
      },
      ...options,
    });

    // new SmallLifePotion(this.items, { player: this.parent });

    // new Staff_0(this.items, { player: this.parent, tag: "Staff_0", onPopulated: (self) => {
    //   (self as Staff_0).attachMagicAffix(new Affix_0(self));
    //   self.registerAction("discard", this.discardItem, { label: "丢弃", events: [new InventoryDiscardEvent(this, self as Staff_0)] });
    // }});
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
    const item = this.items.get(itemIdx);

    item.executeAction(actionID, payload, onError);
  }

  addItem(item: Item) {
    if (this.items.children.indexOf(item) > -1) return;

    item.registerAction("discard", this.discardItem, { label: "丢弃", events: [new InventoryDiscardEvent(this, item)] });

    this.items.add(() => item)
    //this.items.push(item);

    this.root.saveToDB();
  }

  /** Player.Inventory { action: 'discard', index: 0 } */
  discardItem = ({ self }: any) => {
    const item = self as Item;

    this.unhookEvent(item);
    item.onDestroy();

    // this.items = this.items.filter((_item) => _item != item);
  };

  // onEventBefore(event: Event): boolean {
  //   if (super.onEventBefore(event)) return true;

  //   if (event instanceof EquipEvent) {
  //     // equip the equipment
  //     console.log("equipping equipment ...");
  //     this.equipped.equip(event.sender);
  //   } else if (event instanceof UnEquipEvent) {
  //     // unequip the equipment
  //     console.log("unequipping equipment ...");
  //     this.equipped.unequip(event.sender);
  //   }
  // }
}

export class InventoryDiscardEvent extends Event {
  sender: Inventory;
  item: Item;

  constructor(sender: Inventory, item: Item) {
    super(sender);

    this.item = item;
  }
}
