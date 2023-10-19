import Affix from "../Affix";

export default class extends Affix {
  private value: number = .0;

  desc(): string {
    return `法术暴击率增加${this.value * 100}%`;
  }

  protected onEnable(): void {
    this.parent.player.offence.spell.crtRate.increasePercent(this.value);
  }

  protected onDisable(): void {
    this.parent.player.offence.spell.crtRate.increasePercent(-this.value);
  }
}
