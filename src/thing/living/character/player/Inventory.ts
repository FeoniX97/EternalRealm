import Thing from "../../../Thing";
import Item from "../../../item/Item";
import SmallLifePotion from "../../../item/potion/SmallLifePotion";
import Player from "./Player";

export default class Inventory extends Thing {
  readonly items: Item[] = [];

  constructor(parent: Player) {
    super(parent);

    this.items.push(new SmallLifePotion(this, { player: parent }));
  }

  /** Player.Inventory { action: 'use', index: 0 } */
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
}
