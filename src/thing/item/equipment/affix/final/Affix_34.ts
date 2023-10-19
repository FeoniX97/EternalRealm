import Affix from "../Affix";

export default class extends Affix {
  private value: number = .0;

  desc(): string {
    return `命中值增加${this.value * 100}%`;
  }

  protected onEnable(): void {
    this.parent.player.offence.accuracyRating.increasePercent(this.value);
  }

  protected onDisable(): void {
    this.parent.player.offence.accuracyRating.increasePercent(-this.value);
  }
}
