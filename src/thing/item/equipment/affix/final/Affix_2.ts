import Affix from "../Affix";

export default class extends Affix {
  private value: number = 0;

  desc(): string {
    return `护盾增加 + ${this.value}`;
  }

  protected onEnable(): void {
    this.parent.player.resource.es.max.inc(this.value);
  }

  protected onDisable(): void {
   this.parent.player.resource.es.max.dec(this.value);
  }
}
