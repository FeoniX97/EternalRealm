import Event from "../../../../event/Event";
import Thing from "../../../Thing";
import Item from "../../../item/Item";
import SmallLifePotion from "../../../item/potion/SmallLifePotion";
import Player from "./Player";

export default class Inventory extends Thing {
  items: Item[] = [];

  constructor(parent: Player) {
    super(parent);

    const potion = new SmallLifePotion(this, { player: parent });
    potion.registerAction("discard", this.discardItem, { label: "丢弃", event: new InventoryDiscardEvent(this, potion) });
    this.items.push(potion);
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

    item.onDestroy();
    this.items = this.items.filter((_item) => _item != item);
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
