import Thing from "../../../Thing";
import Equipment from "../Equipment";

export interface BasicAffix {}
export interface MagicAffix {}

export default abstract class Affix extends Thing {
  parent: Equipment;

  /** lowest tier is tier 1 */
  tier: number;

  /** enable the affix effect */
  enable() {
    this.onEnable();
  }

  /** disable the affix effect */
  disable() {
    this.onDisable();
  }

  desc() {
   return "";
  }

  /** implement to enable the affix effect */
  protected abstract onEnable(): void;

  /** implement to disable the affix effect */
  protected abstract onDisable(): void;
}
