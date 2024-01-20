import Thing, { Options } from "../thing/Thing";
import Affix_0 from "../thing/item/equipment/affix/final/Affix_0";
import Staff_0 from "../thing/item/equipment/weapon/staff/final/Staff_0";
import Item_0 from "../thing/item/final/Item_0";
import SmallLifePotion from "../thing/item/potion/final/SmallLifePotion";

export default class {
 static classes = { Item_0, SmallLifePotion, Staff_0, Affix_0 };

  static createThing<T extends Thing, O extends Options = Options>(parent: Thing, entityID: string, options: O): T {
    const Class = this.classes[options.className];
    const id = options.id;
    const collection = options.collection;

    return new Class(parent, { entityID, id, collection, ...options }) as T;
  }
}
