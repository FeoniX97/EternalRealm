import Affix from "../Affix";

export default class extends Affix {
  private value: number = 0;

  desc(): string {
    return `护甲 + ${this.value}`;
  }

  protected onEnable(): void {
    this.equipment.player.defence.armour.inc(this.value);
  }

  protected onDisable(): void {
    this.equipment.player.defence.armour.dec(this.value);
  }
}
