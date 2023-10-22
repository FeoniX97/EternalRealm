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

    this.hookEvent(rangeVal);
  }

  onEventAfter(event: Event): void {
    if (event.sender == this.rangeVal.min)
      this.min = this.rangeVal.min.val();

    if (event.sender == this.rangeVal.max)
      this.max = this.rangeVal.max.val();
  }

  onDispose(): void {
    this.unhookEvent(this.rangeVal);
  }
}
