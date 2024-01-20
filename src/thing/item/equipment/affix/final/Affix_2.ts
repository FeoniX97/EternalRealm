import Affix from "../Affix";

export default class extends Affix {
  private value: number = 0;

  desc(): string {
    return `护盾增加 + ${this.value}`;
  }

  protected onEnable(): void {
    this.equipment.player.resource.es.max.inc(this.value);
  }

  protected onDisable(): void {
   this.equipment.player.resource.es.max.dec(this.value);
  }
}
