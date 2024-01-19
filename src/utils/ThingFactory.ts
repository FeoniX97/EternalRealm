import Thing, { Options } from "../thing/Thing";
import Staff_0 from "../thing/item/equipment/weapon/staff/final/Staff_0";
import Item_0 from "../thing/item/final/Item_0";
import SmallLifePotion from "../thing/item/potion/final/SmallLifePotion";

export default class {
 static classes = { Item_0, SmallLifePotion, Staff_0 };

  static createThing<T extends Thing, O extends Options = Options>(parent: Thing, entityID: string, options: O): T {
    console.log("className: " + options.className);
    
    const Class = this.classes[options.className];
    const id = options.id;
    const collection = options.collection;

    return new Class(parent, { entityID, id, collection, ...options }) as T;
  }
}
