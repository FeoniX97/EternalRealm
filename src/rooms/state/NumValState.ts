import Event from "../../event/Event";
import NumVal from "../../thing/value/NumVal";
import MyRoom from "../MyRoom";
import MySchema from "../MySchema";
import { type } from "@colyseus/schema";

export default class NumValState extends MySchema {
  @type("number") value: number;

  numVal: NumVal;

  constructor(numVal: NumVal, room: MyRoom<MySchema>) {
    super(room);

    this.value = numVal.val();
    this.numVal = numVal;

    this.hookEvent(numVal);
  }

  onEventAfter(event: Event): void {
    if (event.sender == this.numVal) {
      this.value = this.numVal.val();
    }
  }

  onDispose(): void {
    this.unhookEvent(this.numVal);
  }
}
