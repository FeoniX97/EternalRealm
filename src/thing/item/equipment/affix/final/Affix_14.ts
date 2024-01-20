import Affix from "../Affix";

export default class extends Affix {
  private value: number = 0;

  desc(): string {
    return `护盾自然恢复 + ${this.value}`;
  }

  protected onEnable(): void {
    this.equipment.player.resource.es.regenPerSec += this.value;
  }

  protected onDisable(): void {
    this.equipment.player.resource.es.regenPerSec -= this.value;
  }
}
