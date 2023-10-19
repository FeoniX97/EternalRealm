import Affix from "../Affix";

export default class extends Affix {
  private value: number = .0;

  desc(): string {
    return `暴击伤害 + ${this.value * 100}%`;
  }

  protected onEnable(): void {
    this.parent.player.offence.crtDamage.inc(this.value);
  }

  protected onDisable(): void {
    this.parent.player.offence.crtDamage.dec(this.value);
  }
}
