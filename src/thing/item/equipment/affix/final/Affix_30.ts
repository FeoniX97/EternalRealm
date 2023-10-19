import Affix from "../Affix";

export default class extends Affix {
  private value: number = .0;

  desc(): string {
    return `攻击暴击率增加${this.value * 100}%`;
  }

  protected onEnable(): void {
    this.parent.player.offence.attack.crtRate.increasePercent(this.value);
  }

  protected onDisable(): void {
    this.parent.player.offence.attack.crtRate.increasePercent(-this.value);
  }
}
