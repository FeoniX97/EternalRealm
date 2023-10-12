import { type, ArraySchema } from "@colyseus/schema";
import Inventory from "../../../thing/living/character/player/Inventory";
import MyRoom from "../../MyRoom";
import MySchema from "../../MySchema";
import Item from "../../../thing/item/Item";
import { Action, ActionEvent } from "../../../thing/Thing";
import Rarity from "../../../thing/Rarity";
import Event from "../../../event/Event";

class ActionState extends MySchema {
  @type("string")
  id: string;

  @type("string")
  label: string;

  constructor(room: MyRoom<InventoryPanelRoomState>, action: Action) {
    super(room);

    this.id = action.id;
    this.label = action.label;
  }
}

class RarityState extends MySchema {
  @type("string")
  name: string;

  @type("number")
  value: number;

  constructor(room: MyRoom<InventoryPanelRoomState>, rarity: Rarity) {
    super(room);

    this.name = rarity.name;
    this.value = rarity.value;
  }
}

export class ItemState extends MySchema {
  readonly item: Item;

  @type("string")
  name: string;

  @type("number")
  itemLevel: number;

  @type("number")
  reqLevel: number;

  @type("string")
  type: string;

  @type(RarityState)
  rarity: RarityState;

  @type("string")
  customDesc: string;

  @type("string")
  desc: string;

  @type([ActionState])
  actions = new ArraySchema<ActionState>();

  constructor(room: MyRoom<InventoryPanelRoomState>, item: Item) {
    super(room);

    this.item = item;

    this.name = item.name;
    this.itemLevel = item.itemLevel;
    this.reqLevel = item.reqLevel;
    this.type = item.type;
    this.rarity = new RarityState(room, item.rarity);
    this.customDesc = item.getCustomDesc();

    this.desc = item.desc;

    for (let action of item.actions) {
      this.actions.push(new ActionState(room, action));
    }

    this.hookEvent(item);
  }

  onEventAfter(event: Event): void {
    super.onEventAfter(event);

    // trigger room to rebuild state when action is executed
    if (event.sender == this.item && event instanceof ActionEvent) {
      this.room.rebuildState();
    }
  }

  onDispose(): void {
    this.unhookEvent(this.item);
  }
}

export default class InventoryPanelRoomState extends MySchema {
  readonly inventory: Inventory;

  @type([ItemState])
  items = new ArraySchema<ItemState>();

  constructor(room: MyRoom<InventoryPanelRoomState>, inventory: Inventory) {
    super(room);

    this.inventory = inventory;

    room.clock.setTimeout(() => {
      room.rebuildState();
    }, 100);
  }

  onAction(entities: string, payload: any, onError: (errCode: string, message: string) => void): void {
    this.inventory.onAction(entities, payload, onError);
  }
}
