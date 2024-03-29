import Event from "../../event/Event";
import Value from "./Value";
import Thing, { Options } from "../Thing";

export interface NumValOptions extends Options {
  base?: number;
  increasePercent?: number;
  incrementPercent?: number;
  positive?: boolean;
  integer?: boolean;
  limit?: number;
}

export default class NumVal extends Value {
  base: number;

  private value: number;

  private increasePercentValue: number;
  private incrementPercentValue: number;

  private isPositive: boolean;
  private isInteger: boolean;

  limit: number;

  constructor(parent: Thing, options?: NumValOptions) {
    super(parent, options);
  }

  protected onPopulated(options?: NumValOptions): void {
    super.onPopulated(options);

    this.base = options?.json?.base ? options?.json?.base : options?.base ? options?.base : 0;
    this.increasePercentValue = options?.json?.increasePercent ? options?.json?.increasePercent : options?.increasePercent ? options?.increasePercent : 0;
    this.incrementPercentValue = options?.json?.incrementPercent ? options?.json?.incrementPercent : options?.incrementPercent ? options?.incrementPercent : 0;
    this.isPositive = options?.positive !== undefined ? options?.positive : true;
    this.isInteger = options?.integer !== undefined ? options?.integer : false;
    this.limit = options?.limit !== undefined ? options?.limit : null;
  }

  /** get the calculated value OR set the base value */
  val(newBaseVal?: number): number {
    if (newBaseVal == null || newBaseVal == this.base) return this.calc(this.base, this.increasePercentValue, this.incrementPercentValue);

    // if (this.isPositive && calculatedValue < 0) newBaseVal = 0;
    // if (this.isInteger) newVal = Math.round(newVal);
    // if (this.limit != -1 && newVal > this.limit) newVal = this.limit;

    const evt = new NumChangeEvent(this, this.calc(), this.limit, {
      baseFrom: this.base,
      baseTo: newBaseVal,
    });

    // num change event is blocked, return the original value
    if (evt.sendEventBefore()) return this.value;

    // if (this.isPositive && evt.to < 0) evt.to = 0;
    // if (this.isInteger) evt.to = Math.round(evt.to);
    // if (this.limit != -1 && evt.to > this.limit) evt.to = this.limit;

    this.base = evt.baseTo;
    this.value = this.calc(evt.baseTo, this.increasePercentValue, this.incrementPercentValue);

    evt.sendEventAfter();

    // save to DB
    this.saveToDB();

    return this.value;
  }

  /** increase the base value */
  inc(incBaseVal: number): void {
    // if (incBaseVal <= 0) return;

    this.val(this.base + incBaseVal);
  }

  /** decrease the base value */
  dec(decBaseVal: number): void {
    // if (decBaseVal <= 0) return;

    this.val(this.base - decBaseVal);
  }

  increasePercent(incPercentVal: number): void {
    const evt = new NumChangeEvent(
      this,
      this.calc(),
      this.limit,
      { baseTo: this.base },
      {
        increasePercentFrom: this.increasePercentValue,
        increasePercentTo: this.increasePercentValue + incPercentVal,
      }
    );

    // num change event is blocked, stop the change
    if (evt.sendEventBefore()) return;

    this.increasePercentValue = evt.increasePercentTo;
    this.value = this.calc(this.base, evt.increasePercentTo, this.incrementPercentValue);

    evt.sendEventAfter();
  }

  incrementPercent(incPercentVal: number): void {
    const evt = new NumChangeEvent(this, this.calc(), this.limit, { baseTo: this.base }, null, {
      incrementPercentFrom: this.incrementPercentValue,
      incrementPercentTo: this.incrementPercentValue + incPercentVal,
    });

    // num change event is blocked, stop the change
    if (evt.sendEventBefore()) return;

    this.incrementPercentValue = evt.incrementPercentTo;
    this.value = this.calc(this.base, this.increasePercentValue, evt.incrementPercentTo);

    evt.sendEventAfter();
  }

  calc(base?: number, increasePercentValue?: number, incrementPercentValue?: number): number {
    if (base == null) base = this.base;

    if (increasePercentValue == null) increasePercentValue = this.increasePercentValue;

    if (incrementPercentValue == null) incrementPercentValue = this.incrementPercentValue;

    let finalValue = base * (1 + increasePercentValue) * (1 + incrementPercentValue);

    if (this.limit != null && finalValue > this.limit) finalValue = this.limit;

    return finalValue;
  }

  getLimit(): number {
    return this.limit;
  }

  /** if specified, the final value will not be above this new limit\
   * If the current value is above the new limit, re-calculate the new value using the new limit and send an after event */
  setLimit(limit: number): void {
    const calculatedValue = this.calc(this.base, this.increasePercentValue, this.incrementPercentValue);

    if (this.increasePercentValue == 0 && this.incrementPercentValue == 0 && calculatedValue > limit) {
      // for value without increase/increments e.g. min of lifebar, just set the base directly instead
      this.val(limit);
    } else if (this.increasePercentValue != 0 || this.incrementPercentValue != 0) {
      if (calculatedValue > this.limit) {
        // for value with increase/increments e.g. min of fire damage, re-calculate the new value using the new limit
        this.limit = limit;
        this.value = this.calc(this.base, this.increasePercentValue, this.incrementPercentValue);
        new NumChangeEvent(this, this.value, limit, { baseTo: this.base }, { increasePercentTo: this.increasePercentValue }, { incrementPercentTo: this.incrementPercentValue }).sendEventAfter();
      } else {
        this.limit = limit;
      }
    }
  }

  getIncreasePercentValue(): number {
    return this.increasePercentValue;
  }

  getIncrementPercentValue(): number {
    return this.incrementPercentValue;
  }

  toJSON() {
    return {
      base: this.base,
      increasePercent: this.increasePercentValue,
      incrementPercent: this.incrementPercentValue,
    };
  }

  protected parseOptions(parentOptions?: NumValOptions) {
    let options = super.parseOptions(parentOptions);

    // convert field: [entityID] -> base
    if (this.entityID in options && options[this.entityID]) {
      options["base"] = options[this.entityID];
      delete options[this.entityID];
    }

    return options;
  }
}

export class NumChangeEvent extends Event {
  sender: NumVal;

  limit: number = null;

  readonly baseFrom: number;
  /** changes only applied if `baseFrom` value is not null, which means there is a base change */
  baseTo: number;

  readonly increasePercentFrom: number;
  /** changes only applied if `increasePercentFrom` value is not null, which means there is an increase percent change */
  increasePercentTo: number;

  readonly incrementPercentFrom: number;
  /** changes only applied if `incrementPercentFrom` value is not null, which means there is an increment percent change */
  incrementPercentTo: number;

  /** the original calculated value */
  readonly originalTo: number;

  constructor(sender: NumVal, originalTo: number, limit?: number, base?: { baseFrom?: number; baseTo: number }, increase?: { increasePercentFrom?: number; increasePercentTo: number }, increment?: { incrementPercentFrom?: number; incrementPercentTo: number }) {
    super(sender);

    this.sender = sender;
    this.originalTo = originalTo;
    this.limit = limit;

    this.baseFrom = base?.baseFrom;
    this.baseTo = base?.baseTo;

    this.increasePercentFrom = increase?.increasePercentFrom;
    this.increasePercentTo = increase?.increasePercentTo ?? 0;

    this.incrementPercentFrom = increment?.incrementPercentFrom;
    this.incrementPercentTo = increment?.incrementPercentTo ?? 0;
  }

  /** get the new calculated value */
  to(): number {
    let finalValue = this.baseTo * (1 + this.increasePercentTo) * (1 + this.incrementPercentTo);

    if (this.limit != null && finalValue > this.limit) finalValue = this.limit;

    return finalValue;
  }

  /** get the difference between the original value and the new calculated value */
  diff(): number {
    return this.to() - this.originalTo;
  }
}
