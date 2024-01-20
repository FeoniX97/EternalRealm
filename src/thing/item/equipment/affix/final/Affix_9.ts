import Affix from "../Affix";

export default class extends Affix {
  private value: number = 0;

  desc(): string {
    return `力量 + ${this.value}`;
  }

  protected onEnable(): void {
    this.equipment.player.core.str.inc(this.value);
  }

  protected onDisable(): void {
   this.equipment.player.core.str.dec(this.value);
  }
}
