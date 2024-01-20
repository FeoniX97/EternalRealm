import Affix from "../Affix";

export default class extends Affix {
  private value: number = 0;

  desc(): string {
    return `智力 + ${this.value}`;
  }

  protected onEnable(): void {
    this.equipment.player.core.int.inc(this.value);
  }

  protected onDisable(): void {
   this.equipment.player.core.int.dec(this.value);
  }
}
