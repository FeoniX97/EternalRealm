import Event from "../../event/Event";
import RangeVal from "../../thing/value/RangeVal";
import State from "./State";
import { type } from "@colyseus/schema";

export default class RangeValState extends State {
  @type("int32") min: number;
  @type("int32") max: number;

  rangeVal: RangeVal;

  constructor(rangeVal: RangeVal, parent?: State) {
    super(parent);

    this.min = rangeVal.min.val();
    this.max = rangeVal.max.val();
    this.rangeVal = rangeVal;

    this.hookEvent(rangeVal.min, rangeVal.max);
  }

  onEventAfter(event: Event): void {
    if (event.sender == this.rangeVal.min) {
      this.min = this.rangeVal.min.val();
    } else if (event.sender == this.rangeVal.max) {
      this.max = this.rangeVal.max.val();
    }

    // if (
    //   event.sender == this.rangeVal.min ||
    //   event.sender == this.rangeVal.max
    // ) {
    //   console.log("life changed, calling parent state change");
    //   this.onStateChanged(this);
    // }
  }

  onDispose(): void {
    this.unhookEvent(this.rangeVal.min, this.rangeVal.max);
  }
}
