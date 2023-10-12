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
    if (this.eventListeners.length > 0) {
      // send the received events to all hooked listeners also
      for (let eventListener of this.eventListeners) {
        eventListener.onEventAfter(event);
      }
    } else {
      this.onDispose();
      this.room.rebuildState(this);
    }
  }

  onDispose(): void {
    this.unhookEvent(this.numVal);
  }
}
