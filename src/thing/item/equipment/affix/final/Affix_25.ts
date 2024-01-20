import Affix from "../Affix";

export default class extends Affix {
  private min: number = 0;
  private max: number = 0;

  desc(): string {
    return `冰霜法术伤害 + ${this.min} ~ ${this.max}`;
  }

  protected onEnable(): void {
    this.equipment.player.offence.spell.cold.max.inc(this.max);
    this.equipment.player.offence.spell.cold.min.inc(this.min);
  }

  protected onDisable(): void {
    this.equipment.player.offence.spell.cold.min.dec(this.min);
    this.equipment.player.offence.spell.cold.max.dec(this.max);
  }
}
