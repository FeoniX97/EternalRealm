import Thing, { Options } from "../thing/Thing";
import Item_0 from "../thing/item/final/Item_0";
import SmallLifePotion from "../thing/item/potion/SmallLifePotion";

export default class {
 static classes = { Item_0, SmallLifePotion };

  static createThing<T extends Thing, O extends Options = Options>(parent: Thing, entityID: string, options: O): T {
    const Class = this.classes[options.className];
    const id = options.id;
    const collection = options.collection;

    return new Class(parent, { entityID, id, collection, ...options }) as T;
  }
}
