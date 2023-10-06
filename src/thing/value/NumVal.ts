import { listen } from "@colyseus/tools";
import Event from "../../event/Event";
import EventSender from "../../event/EventSender";
import Value from "./Value";

export default class NumVal extends Value {
  private base: number;
  private value: number;

  private increasePercentValue: number = 0;
  private incrementPercentValue: number = 0;

  private isPositive: boolean;
  private isInteger: boolean;
  private limit: number = null;

  constructor(value: number = 0, options?: NumValOptions) {
    super();

    this.value = value;
    this.isPositive = options?.positive;
    this.isInteger = options?.integer;
    this.limit = options?.limit ?? -1;
  }

  /** get/set the base value */
  val(newBaseVal?: number): number {
    if (!newBaseVal) return this.value;
    if (newBaseVal == this.base) return this.value;
    // if (this.isPositive && calculatedValue < 0) newBaseVal = 0;
    // if (this.isInteger) newVal = Math.round(newVal);
    // if (this.limit != -1 && newVal > this.limit) newVal = this.limit;

    const evt = new NumChangeEvent(this, this.limit, {
      baseFrom: this.base,
      baseTo: newBaseVal,
    });

    // num change event is blocked, return the original value
    if (evt.sendEventBefore()) return this.value;

    // if (this.isPositive && evt.to < 0) evt.to = 0;
    // if (this.isInteger) evt.to = Math.round(evt.to);
    // if (this.limit != -1 && evt.to > this.limit) evt.to = this.limit;

    this.value = this.calc(
      evt.baseTo,
      this.increasePercentValue,
      this.incrementPercentValue
    );

    evt.sendEventAfter();

    return this.value;
  }

  /** increase the base value */
  inc(incBaseVal: number): void {
    if (incBaseVal <= 0) return;

    this.val(this.base + incBaseVal);
  }

  /** decrease the base value */
  dec(decBaseVal: number): void {
    if (decBaseVal <= 0) return;

    this.val(this.base - decBaseVal);
  }

  increasePercent(incPercentVal: number): void {
    const evt = new NumChangeEvent(this, this.limit, null, {
      increasePercentFrom: this.increasePercentValue,
      increasePercentTo: this.increasePercentValue + incPercentVal,
    });

    // num change event is blocked, stop the change
    if (evt.sendEventBefore()) return;

    this.value = this.calc(
      this.base,
      evt.increasePercentTo,
      this.incrementPercentValue
    );

    evt.sendEventAfter();
  }

  incrementPercent(incPercentVal: number): void {
    const evt = new NumChangeEvent(this, this.limit, null, null, {
      incrementPercentFrom: this.incrementPercentValue,
      incrementPercentTo: this.incrementPercentValue + incPercentVal,
    });

    // num change event is blocked, stop the change
    if (evt.sendEventBefore()) return;

    this.value = this.calc(
      this.base,
      this.increasePercentValue,
      evt.incrementPercentTo
    );

    evt.sendEventAfter();
  }

  calc(
    base: number,
    increasePercentValue: number,
    incrementPercentValue: number
  ): number {
    let finalValue =
      base * (1 + increasePercentValue) * (1 + incrementPercentValue);

    if (this.limit != null && finalValue > this.limit) finalValue = this.limit;

    return finalValue;
  }

  getLimit(): number {
    return this.limit;
  }

  /** if specified, the final value will not be above this new limit\
   * If the current value is above the new limit, re-calculate the new value using the new limit and send an after event */
  setLimit(limit: number): void {
    const calculatedValue = this.calc(
      this.base,
      this.increasePercentValue,
      this.incrementPercentValue
    );

    if (calculatedValue > this.limit) {
      if (this.increasePercentValue == 0 && this.incrementPercentValue) {
        // for value without increase/increments e.g. min of lifebar, just set the base directly instead
        this.val(limit);
      } else {
        // for value with increase/increments e.g. min of fire damage, re-calculate the new value using the new limit
        this.limit = limit;
        this.value = this.calc(
          this.base,
          this.increasePercentValue,
          this.incrementPercentValue
        );
        new NumChangeEvent(
          this,
          limit,
          { baseTo: this.base },
          { increasePercentTo: this.increasePercentValue },
          { incrementPercentTo: this.incrementPercentValue }
        ).sendEventAfter();
      }
    } else {
      if (this.increasePercentValue != 0 || this.incrementPercentValue != 0)
        this.limit = limit;
    }
  }
}

export interface NumValOptions {
  positive?: boolean;
  integer?: boolean;
  limit?: number;
}

export class NumChangeEvent extends Event {
  sender: NumVal;

  private readonly limit: number = null;

  readonly baseFrom: number;
  /** changes only applied if `baseFrom` value is not null, which means there is a base change */
  baseTo: number;

  readonly increasePercentFrom: number;
  /** changes only applied if `increasePercentFrom` value is not null, which means there is an increase percent change */
  increasePercentTo: number;

  readonly incrementPercentFrom: number;
  /** changes only applied if `incrementPercentFrom` value is not null, which means there is an increment percent change */
  incrementPercentTo: number;

  constructor(
    sender: NumVal,
    limit?: number,
    base?: { baseFrom?: number; baseTo: number },
    increase?: { increasePercentFrom?: number; increasePercentTo: number },
    increment?: { incrementPercentFrom?: number; incrementPercentTo: number }
  ) {
    super(sender);

    this.sender = sender;
    this.limit = limit;

    this.baseFrom = base?.baseFrom;
    this.baseTo = base?.baseTo;

    this.increasePercentFrom = increase?.increasePercentFrom;
    this.increasePercentTo = increase?.increasePercentTo;

    this.incrementPercentFrom = increment?.incrementPercentFrom;
    this.incrementPercentTo = increment?.incrementPercentTo;
  }

  /** get the final calculated value */
  to(): number {
    let finalValue =
      this.baseTo *
      (1 + this.increasePercentTo) *
      (1 + this.incrementPercentTo);

    if (this.limit != null && finalValue > this.limit) finalValue = this.limit;

    return finalValue;
  }
}
