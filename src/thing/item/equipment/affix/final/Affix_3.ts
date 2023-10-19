import Affix from "../Affix";

export default class extends Affix {
  private value: number = .0;

  desc(): string {
    return `生命上限增加${this.value * 100}%`;
  }

  protected onEnable(): void {
    this.parent.player.resource.life.max.increasePercent(this.value);
  }

  protected onDisable(): void {
   this.parent.player.resource.life.max.increasePercent(-this.value);
  }
}
