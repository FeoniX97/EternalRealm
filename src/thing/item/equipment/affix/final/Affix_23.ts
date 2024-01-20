import Affix from "../Affix";

export default class extends Affix {
  private min: number = 0;
  private max: number = 0;

  desc(): string {
    return `混沌攻击伤害 + ${this.min} ~ ${this.max}`;
  }

  protected onEnable(): void {
    this.equipment.player.offence.attack.chaos.max.inc(this.max);
    this.equipment.player.offence.attack.chaos.min.inc(this.min);
  }

  protected onDisable(): void {
    this.equipment.player.offence.attack.chaos.min.dec(this.min);
    this.equipment.player.offence.attack.chaos.max.dec(this.max);
  }
}
