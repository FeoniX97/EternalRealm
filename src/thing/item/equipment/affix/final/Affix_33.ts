import Affix from "../Affix";

export default class extends Affix {
  private value: number = 0;

  desc(): string {
    return `命中值 + ${this.value}`;
  }

  protected onEnable(): void {
    this.parent.player.offence.accuracyRating.inc(this.value);
  }

  protected onDisable(): void {
    this.parent.player.offence.accuracyRating.dec(this.value);
  }
}
