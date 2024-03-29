import Affix from "../Affix";

export default class extends Affix {
  private min: number = 0;
  private max: number = 0;

  desc(): string {
    return `闪电攻击伤害 + ${this.min} ~ ${this.max}`;
  }

  protected onEnable(): void {
    this.parent.player.offence.attack.lightning.max.inc(this.max);
    this.parent.player.offence.attack.lightning.min.inc(this.min);
  }

  protected onDisable(): void {
    this.parent.player.offence.attack.lightning.min.dec(this.min);
    this.parent.player.offence.attack.lightning.max.dec(this.max);
  }
}
