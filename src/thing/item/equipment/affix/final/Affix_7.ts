import Affix from "../Affix";

export default class extends Affix {
  private value: number = .0;

  desc(): string {
    return `法力上限增幅${this.value * 100}%`;
  }

  protected onEnable(): void {
    this.parent.player.resource.mana.max.incrementPercent(this.value);
  }

  protected onDisable(): void {
   this.parent.player.resource.mana.max.incrementPercent(-this.value);
  }
}
