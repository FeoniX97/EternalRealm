import Affix from "../Affix";

export default class extends Affix {
  private value: number = .0;

  desc(): string {
    return `护盾自然恢复增加${this.value * 100}%`;
  }

  protected onEnable(): void {
    this.equipment.player.resource.es.regenPercentPerSec += this.value;
  }

  protected onDisable(): void {
    this.equipment.player.resource.es.regenPercentPerSec -= this.value;
  }
}
