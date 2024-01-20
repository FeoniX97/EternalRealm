import Affix from "../Affix";

export default class extends Affix {
  private min: number = 0;
  private max: number = 0;

  desc(): string {
    return `闪电法术伤害 + ${this.min} ~ ${this.max}`;
  }

  protected onEnable(): void {
    this.equipment.player.offence.spell.lightning.max.inc(this.max);
    this.equipment.player.offence.spell.lightning.min.inc(this.min);
  }

  protected onDisable(): void {
    this.equipment.player.offence.spell.lightning.min.dec(this.min);
    this.equipment.player.offence.spell.lightning.max.dec(this.max);
  }
}
