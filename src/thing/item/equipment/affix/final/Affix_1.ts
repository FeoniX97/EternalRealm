import Affix from "../Affix";

export default class extends Affix {
  private value: number = 0;

  desc(): string {
    return `法力增加 + ${this.value}`;
  }

  protected onEnable(): void {
    this.parent.player.resource.mana.max.inc(this.value);
  }

  protected onDisable(): void {
   this.parent.player.resource.mana.max.dec(this.value);
  }
}
