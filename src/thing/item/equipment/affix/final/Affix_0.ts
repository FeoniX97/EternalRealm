import Affix from "../Affix";

export default class extends Affix {
  private value: number = 5;

  desc(): string {
    return `生命上限 + ${this.value}`;
  }

  protected onEnable(): void {
    this.parent.player.resource.life.max.inc(this.value);
  }

  protected onDisable(): void {
   this.parent.player.resource.life.max.dec(this.value);
  }
}
