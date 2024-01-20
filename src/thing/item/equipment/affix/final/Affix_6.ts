import Affix from "../Affix";

export default class extends Affix {
  private value: number = .0;

  desc(): string {
    return `生命上限增幅${this.value * 100}%`;
  }

  protected onEnable(): void {
    this.equipment.player.resource.life.max.incrementPercent(this.value);
  }

  protected onDisable(): void {
   this.equipment.player.resource.life.max.incrementPercent(-this.value);
  }
}
