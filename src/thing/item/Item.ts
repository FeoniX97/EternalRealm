import Event from "../../event/Event";
import Rarity from "../Rarity";
import Thing, { Options } from "../Thing";
import Player from "../living/character/player/Player";
import NumVal from "../value/NumVal";
import StrVal from "../value/StrVal";

export interface ItemOptions extends Options {
  name: string;
  player?: Player;
  itemLevel?: number;
  reqLevel?: number;
  rarity?: Rarity;
  desc?: string;
  type?: string;
}

export default abstract class Item extends Thing {
  readonly player?: Player;

  /** the item name */
  name: StrVal;

  /** the item level */
  itemLevel: NumVal;

  /** the required level to use the item */
  reqLevel: NumVal;

  desc: StrVal;

  rarity: Rarity;

  type: StrVal;

  constructor(parent: Thing, options?: ItemOptions) {
    super(parent, options);

    // this.name = name;
    // this.player = options?.player;
    // this.itemLevel = options?.itemLevel ?? 1;
    // this.reqLevel = options?.reqLevel ?? 1;
    // this.desc = options?.desc ?? "这个作者很懒，什么都没写";
    // this.type = options?.type ?? "物品";
    // this.rarity = options?.rarity ?? Rarity.normal;
  }

  protected onPopulated(options?: ItemOptions): void {
    super.onPopulated(options);

    this.name = new StrVal(this, { value: "物品", entityID: "name", ...this.parseOptions(options) });
    this.itemLevel = new NumVal(this, { entityID: "itemLevel", ...this.parseOptions(options) });
    this.reqLevel = new NumVal(this, { entityID: "reqLevel", ...this.parseOptions(options) });
    this.desc = new StrVal(this, { entityID: "desc", ...this.parseOptions(options) });
    // this.rarity = new Rarity(this, {  })

    this.hookEvent(this);
    this.registerAction("use", this.onUse, { events: [new ItemUseEvent(this)], label: "使用" });
  }

  protected abstract onUse(payload: any): void;

  /** the custom desc of the displaying popup of the item in client */
  getCustomDesc(): string[] {
    return [];
  }

  onEventBefore(event: Event): boolean {
    if (super.onEventBefore(event)) return true;

    // ensure player level meets requirement
    if (event.sender == this && event instanceof ItemUseEvent) {
      if (this.player.level.base < this.reqLevel) {
        event.blocked = true;
        event.errMessage = "level req not met to use item: " + this.name;
      }
    }
  }
}

export class ItemUseEvent extends Event {
  constructor(sender: Item) {
    super(sender);
  }
}
