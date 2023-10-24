import Thing, { Options } from "../Thing";
import Value from "./Value";

export interface StrValOptions extends Options {
  value?: string;
}

export default class StrVal extends Value {
  private value: string;

  constructor(parent: Thing, options?: StrValOptions) {
    super(parent, options);
  }

  protected onPopulated(options?: StrValOptions): void {
    super.onPopulated(options);

    this.value = options?.json?.value ? options?.json?.value : options?.value ? options?.value : "";
  }

  val(newVal?: string) {
    if (newVal) this.value = newVal;

    return this.value;
  }

  toJSON() {
    return {
      value: this.value,
    };
  }

  protected parseOptions(parentOptions?: StrValOptions) {
    let options = super.parseOptions(parentOptions);

    // convert field: [entityID] -> value
    if (this.entityID in options && options[this.entityID]) {
      options["value"] = options[this.entityID];
      delete options[this.entityID];
    }

    return options;
  }
}
