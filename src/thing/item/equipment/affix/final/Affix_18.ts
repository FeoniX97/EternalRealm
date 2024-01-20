import Affix from "../Affix";

export default class extends Affix {
  private value: number = .0;

  desc(): string {
    return `护盾充能增加${this.value * 100}%`;
  }

  protected onEnable(): void {
    this.equipment.player.resource.es.rechargePercentPerSec *= 1 + this.value;
  }

  protected onDisable(): void {
    this.equipment.player.resource.es.rechargePercentPerSec *= 1 - this.value;
  }
}
