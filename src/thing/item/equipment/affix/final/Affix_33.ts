import Affix from "../Affix";

export default class extends Affix {
  private value: number = 0;

  desc(): string {
    return `命中值 + ${this.value}`;
  }

  protected onEnable(): void {
    this.equipment.player.offence.accuracyRating.inc(this.value);
  }

  protected onDisable(): void {
    this.equipment.player.offence.accuracyRating.dec(this.value);
  }
}
