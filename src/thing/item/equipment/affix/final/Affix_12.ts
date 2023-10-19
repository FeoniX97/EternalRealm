import Affix from "../Affix";

export default class extends Affix {
  private value: number = 0;

  desc(): string {
    return `生命自然恢复 + ${this.value}`;
  }

  protected onEnable(): void {
    this.parent.player.resource.life.regenPerSec += this.value;
  }

  protected onDisable(): void {
    this.parent.player.resource.life.regenPerSec -= this.value;
  }
}
