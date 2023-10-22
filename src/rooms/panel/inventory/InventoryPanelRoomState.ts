import { type, ArraySchema } from "@colyseus/schema";
import Inventory, { InventoryDiscardEvent } from "../../../thing/living/character/player/Inventory";
import MyRoom from "../../MyRoom";
import MySchema from "../../MySchema";
import Item from "../../../thing/item/Item";
import { Action, ActionEvent } from "../../../thing/Thing";
import Rarity from "../../../thing/Rarity";
import Event from "../../../event/Event";
import Equipment from "../../../thing/item/equipment/Equipment";
import InventoryPanelRoom from "./InventoryPanelRoom";

class ActionState extends MySchema {
  @type("string")
  id: string;

  @type("string")
  label: string;

  @type("boolean")
  enabled: boolean;

  constructor(room: MyRoom<InventoryPanelRoomState>, action: Action) {
    super(room);

    this.id = action.id;
    this.label = action.label;
    this.enabled = action.enabled;
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
  room: MyRoom<InventoryPanelRoomState>;

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

  @type(["string"])
  customDesc = new ArraySchema<string>();

  /** for equipments */
  @type(["string"])
  basicAffixes = new ArraySchema<string>();

  /** for equipments */
  @type(["string"])
  magicAffixes = new ArraySchema<string>();

  @type("string")
  desc: string;

  @type([ActionState])
  actions = new ArraySchema<ActionState>();

  constructor(room: MyRoom<InventoryPanelRoomState>, item: Item) {
    super(room);

    this.item = item;

    this.rebuildState();

    this.hookEvent(item);
  }

  rebuildState() {
    this.name = this.item.name;
    this.itemLevel = this.item.itemLevel;
    this.reqLevel = this.item.reqLevel;
    this.type = this.item.type;
    this.rarity = new RarityState(this.room, this.item.rarity);
    this.customDesc.push(...this.item.getCustomDesc());
    this.desc = this.item.desc;

    if (this.item instanceof Equipment) {
      for (let basicAffix of this.item.basicAffixes) {
        this.basicAffixes.push(basicAffix.desc());
      }

      for (let magicAffix of this.item.magicAffixes) {
        this.magicAffixes.push(magicAffix.desc());
      }
    }

    for (let action of this.item.actions) {
      this.actions.push(new ActionState(this.room, action));
    }
  }

  onEventAfter(event: Event): void {
    super.onEventAfter(event);

    // trigger rebuild state when action is executed
    if (event.sender == this.item && event instanceof ActionEvent) {
      this.rebuildState();
    }
  }

  onDispose(): void {
    super.onDispose();
    this.unhookEvent(this.item);
  }
}

export default class InventoryPanelRoomState extends MySchema {
  room: MyRoom<InventoryPanelRoomState>;

  readonly inventory: Inventory;

  @type([ItemState])
  items = new ArraySchema<ItemState>();

  constructor(room: MyRoom<InventoryPanelRoomState>, inventory: Inventory) {
    super(room);

    this.inventory = inventory;

    this.rebuildState();

    this.hookEvent(inventory);
  }

  rebuildState() {
    this.items.forEach((item) => item.onDispose());
    this.items.clear();
    this.items = new ArraySchema<ItemState>();

    for (let item of this.inventory.items) {
      this.items.push(new ItemState(this.room, item));
    }
  }

  discardItem(item: Item) {
    let itemState = this.items.find((i) => i.item === item);

    if (itemState) {
      this.items.deleteAt(this.items.indexOf(itemState));
    }
  }

  onAction(entities: string, payload: any, onError: (errCode: string, message: string) => void): void {
    this.inventory.onAction(entities, payload, onError);
  }

  onEventAfter(event: Event): void {
    super.onEventAfter(event);

    // listen to inventory discard event
    if (event instanceof InventoryDiscardEvent && event.sender == this.inventory) {
      this.discardItem(event.item);
    }
  }

  onDispose(): void {
    super.onDispose();
    this.unhookEvent(this.inventory);
  }
}
