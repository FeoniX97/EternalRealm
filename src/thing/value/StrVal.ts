import Thing, { Options } from "../Thing";
import Value from "./Value";

export interface StrValOptions extends Options {
  value?: string;
}

export default class StrVal extends Value {
  private value: string;

  constructor(parent: Thing, options?: StrValOptions) {
    super(parent, options);

    options = this.parseOptions(options);

    this.value = options?.json?.value ? options?.json?.value : options?.value ? options?.value : "";
  }

  val(newVal: string) {
    this.value = newVal;

    return this.value;
  }

  toJSON() {
    return {
      value: this.value,
    };
  }
}
