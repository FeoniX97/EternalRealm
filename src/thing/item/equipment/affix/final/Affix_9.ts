import Affix from "../Affix";

export default class extends Affix {
  private value: number = 0;

  desc(): string {
    return `力量 + ${this.value}`;
  }

  protected onEnable(): void {
    this.parent.player.core.str.inc(this.value);
  }

  protected onDisable(): void {
   this.parent.player.core.str.dec(this.value);
  }
}
