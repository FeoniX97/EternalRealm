import { Options } from "../../../../Thing";
import Affix from "../Affix";

export default class Affix_0 extends Affix {
  private value: number = 5;

  protected onPopulated(options?: Options): void {
      super.onPopulated(options);

      this.value = options.json?.value ?? 5;
  }

  desc(): string {
    return `生命上限 + ${this.value}`;
  }

  protected onEnable(): void {
    this.equipment.player.resource.life.max.inc(this.value);
  }

  protected onDisable(): void {
    this.equipment.player.resource.life.max.dec(this.value);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      value: this.value,
    };
  }
}
