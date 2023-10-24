import Thing, { Options } from "../thing/Thing";
import Item_0 from "../thing/item/final/Item_0";

export class Log {
  static success(message: string) {
    console.log("\u001b[1;32m" + message + "\u001b[0m");
  }

  static error(message: string) {
    console.log("\u001b[1;31m" + message + "\u001b[0m");
  }
}

export function fromPercent(percent: number) {
  return percent / 100.0;
}

const classes = { Item_0 };

export function createThing<T extends Thing, O extends Options = Options>(parent: Thing, entityID: string, options: O): T {
  const itemJson = options?.json?.item;
  const Class = classes[itemJson.className];

  return new Class(parent, { entityID, id: itemJson.id, ...options }) as T;
}
