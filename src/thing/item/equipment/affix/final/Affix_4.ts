import Affix from "../Affix";

export default class extends Affix {
  private value: number = .0;

  desc(): string {
    return `法力上限增加${this.value * 100}%`;
  }

  protected onEnable(): void {
    this.equipment.player.resource.mana.max.increasePercent(this.value);
  }

  protected onDisable(): void {
   this.equipment.player.resource.mana.max.increasePercent(-this.value);
  }
}
