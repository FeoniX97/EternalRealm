import Thing, { Options } from "../thing/Thing";
import ThingFactory from "./ThingFactory";

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

export function createThing<T extends Thing, O extends Options = Options>(parent: Thing, entityID: string, options: O): T {
  return ThingFactory.createThing(parent, entityID, options);
}
