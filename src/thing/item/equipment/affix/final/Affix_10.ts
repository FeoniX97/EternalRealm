import Affix from "../Affix";

export default class extends Affix {
  private value: number = 0;

  desc(): string {
    return `灵巧 + ${this.value}`;
  }

  protected onEnable(): void {
    this.equipment.player.core.agi.inc(this.value);
  }

  protected onDisable(): void {
   this.equipment.player.core.agi.dec(this.value);
  }
}
