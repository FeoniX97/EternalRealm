import Affix from "../Affix";

export default class extends Affix {
  private value: number = 0;

  desc(): string {
    return `法力增加 + ${this.value}`;
  }

  protected onEnable(): void {
    this.equipment.player.resource.mana.max.inc(this.value);
  }

  protected onDisable(): void {
   this.equipment.player.resource.mana.max.dec(this.value);
  }
}
