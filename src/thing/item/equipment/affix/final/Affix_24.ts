import Affix from "../Affix";

export default class extends Affix {
  private min: number = 0;
  private max: number = 0;

  desc(): string {
    return `火焰法术伤害 + ${this.min} ~ ${this.max}`;
  }

  protected onEnable(): void {
    this.parent.player.offence.spell.fire.max.inc(this.max);
    this.parent.player.offence.spell.fire.min.inc(this.min);
  }

  protected onDisable(): void {
    this.parent.player.offence.spell.fire.min.dec(this.min);
    this.parent.player.offence.spell.fire.max.dec(this.max);
  }
}
