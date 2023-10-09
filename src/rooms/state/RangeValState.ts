import Event from "../../event/Event";
import RangeVal from "../../thing/value/RangeVal";
import MyRoom from "../MyRoom";
import MySchema from "../MySchema";
import { type } from "@colyseus/schema";

export default class RangeValState extends MySchema {
  @type("number") min: number;
  @type("number") max: number;

  rangeVal: RangeVal;

  constructor(rangeVal: RangeVal, room: MyRoom<MySchema>) {
    super(room);

    this.min = rangeVal.min.val();
    this.max = rangeVal.max.val();
    this.rangeVal = rangeVal;

    this.hookEvent(rangeVal.min, rangeVal.max);
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

    // if (event.sender == this.rangeVal.min) {
    //   this.min = this.rangeVal.min.val();
    // } else if (event.sender == this.rangeVal.max) {
    //   this.max = this.rangeVal.max.val();
    // }
  }

  onDispose(): void {
    this.unhookEvent(this.rangeVal.min, this.rangeVal.max);
  }
}
