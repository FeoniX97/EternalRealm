import Event from "../../../../event/Event";
import { fromPercent } from "../../../../utils/utils";
import NumVal from "../../../value/NumVal";
import RangeVal from "../../../value/RangeVal";
import { ItemOptions } from "../../Item";
import Equipment, { EquipEvent, UnEquipEvent } from "../Equipment";

export interface OneHanded {
  isOneHanded: boolean;
}

export interface TwoHanded {
  isTwoHanded: boolean;
}

export interface OffHanded {
  isOffHanded: boolean;
}

export interface AttackerWeapon {
  isAttackerWeapon: boolean;
  range: NumVal;
}

export interface CasterWeapon {
  isCasterWeapon: boolean;
}

export default abstract class Weapon extends Equipment {
  phyDamage: RangeVal;
  fireDamage: RangeVal;
  coldDamage: RangeVal;
  lightningDamage: RangeVal;
  chaosDamage: RangeVal;
  speed: NumVal;
  crtRate: NumVal;

  static isOneHanded(obj: any): obj is Weapon {
    return "isOneHanded" in obj;
  }

  static isTwoHanded(obj: any): obj is Weapon {
    return "isTwoHanded" in obj;
  }

  static isOffHanded(obj: any): obj is Weapon {
    return "isOffHanded" in obj;
  }

  static isAttackerWeapon(obj: any): obj is AttackerWeapon {
    return "isAttackerWeapon" in obj;
  }

  static isCasterWeapon(obj: any): obj is Weapon {
    return "isCasterWeapon" in obj;
  }

  protected onPopulated(options?: ItemOptions): void {
    super.onPopulated(options);

    this.phyDamage = new RangeVal(this, { entityID: "phyDamage", ...this.parseOptions(options) });
    this.fireDamage = new RangeVal(this);
    this.coldDamage = new RangeVal(this);
    this.lightningDamage = new RangeVal(this);
    this.chaosDamage = new RangeVal(this);
    this.speed = new NumVal(this, 0.8);
    this.crtRate = new NumVal(this, fromPercent(8));
  }

  getCustomDesc(): string[] {
    let phyDamage = this.phyDamage.min.val() ? `物理伤害: ${this.phyDamage.min.val()} ~ ${this.phyDamage.max.val()}\n` : "";
    let fireDamage = this.fireDamage.min.val() ? `火焰伤害: ${this.fireDamage.min.val()} ~ ${this.fireDamage.max.val()}\n` : "";
    let coldDamage = this.coldDamage.min.val() ? `冰霜伤害: ${this.coldDamage.min.val()} ~ ${this.coldDamage.max.val()}\n` : "";
    let lightningDamage = this.lightningDamage.min.val() ? `闪电伤害: ${this.lightningDamage.min.val()} ~ ${this.lightningDamage.max.val()}<br />` : "";
    let chaosDamage = this.chaosDamage.min.val() ? `火焰伤害: ${this.chaosDamage.min.val()} ~ ${this.chaosDamage.max.val()}\n` : "";
    let speed = `${Weapon.isAttackerWeapon(this) ? "攻击" : "施法"}速度: ${this.speed.val()}/s\n`;
    let crtRate = `暴击率: ${this.crtRate.val() * 100}%\n`;
    let range = Weapon.isAttackerWeapon(this) ? `武器范围: ${this.range}` : "";

    let customDesc: string[] = [];

    if (phyDamage) customDesc.push(phyDamage);
    if (fireDamage) customDesc.push(fireDamage);
    if (coldDamage) customDesc.push(coldDamage);
    if (lightningDamage) customDesc.push(lightningDamage);
    if (chaosDamage) customDesc.push(chaosDamage);
    if (speed) customDesc.push(speed);
    if (crtRate) customDesc.push(crtRate);
    if (range) customDesc.push(range);

    return [...super.getCustomDesc(), ...customDesc];
  }

  onEventAfter(event: Event): void {
    super.onEventAfter(event);

    if (event instanceof EquipEvent && event.sender == this) {
      if (Weapon.isAttackerWeapon(this)) {
        this.player.offence.attack.physical.max.inc(this.phyDamage.max.val());
        this.player.offence.attack.physical.min.inc(this.phyDamage.min.val());
        this.player.offence.attack.fire.max.inc(this.fireDamage.max.val());
        this.player.offence.attack.fire.min.inc(this.fireDamage.min.val());
        this.player.offence.attack.cold.max.inc(this.coldDamage.max.val());
        this.player.offence.attack.cold.min.inc(this.coldDamage.min.val());
        this.player.offence.attack.lightning.max.inc(this.lightningDamage.max.val());
        this.player.offence.attack.lightning.min.inc(this.lightningDamage.min.val());
        this.player.offence.attack.chaos.max.inc(this.chaosDamage.max.val());
        this.player.offence.attack.chaos.min.inc(this.chaosDamage.min.val());
        this.player.offence.attack.speed.inc(this.speed.val());
        this.player.offence.attack.crtRate.inc(this.crtRate.val());
      } else if (Weapon.isCasterWeapon(this)) {
        this.player.offence.spell.fire.max.inc(this.fireDamage.max.val());
        this.player.offence.spell.fire.min.inc(this.fireDamage.min.val());
        this.player.offence.spell.cold.max.inc(this.coldDamage.max.val());
        this.player.offence.spell.cold.min.inc(this.coldDamage.min.val());
        this.player.offence.spell.lightning.max.inc(this.lightningDamage.max.val());
        this.player.offence.spell.lightning.min.inc(this.lightningDamage.min.val());
        this.player.offence.spell.chaos.max.inc(this.chaosDamage.max.val());
        this.player.offence.spell.chaos.min.inc(this.chaosDamage.min.val());
        this.player.offence.spell.speed.inc(this.speed.val());
        this.player.offence.spell.crtRate.inc(this.crtRate.val());
      }
    } else if (event instanceof UnEquipEvent && event.sender == this) {
      if (Weapon.isAttackerWeapon(this)) {
        this.player.offence.attack.physical.min.dec(this.phyDamage.min.val());
        this.player.offence.attack.physical.max.dec(this.phyDamage.max.val());
        this.player.offence.attack.fire.min.dec(this.fireDamage.min.val());
        this.player.offence.attack.fire.max.dec(this.fireDamage.max.val());
        this.player.offence.attack.cold.min.dec(this.coldDamage.min.val());
        this.player.offence.attack.cold.max.dec(this.coldDamage.max.val());
        this.player.offence.attack.lightning.min.dec(this.lightningDamage.min.val());
        this.player.offence.attack.lightning.max.dec(this.lightningDamage.max.val());
        this.player.offence.attack.chaos.min.dec(this.chaosDamage.min.val());
        this.player.offence.attack.chaos.max.dec(this.chaosDamage.max.val());
        this.player.offence.attack.speed.dec(this.speed.val());
        this.player.offence.attack.crtRate.dec(this.crtRate.val());
      } else if (Weapon.isCasterWeapon(this)) {
        this.player.offence.spell.fire.min.dec(this.fireDamage.min.val());
        this.player.offence.spell.fire.max.dec(this.fireDamage.max.val());
        this.player.offence.spell.cold.min.dec(this.coldDamage.min.val());
        this.player.offence.spell.cold.max.dec(this.coldDamage.max.val());
        this.player.offence.spell.lightning.min.dec(this.lightningDamage.min.val());
        this.player.offence.spell.lightning.max.dec(this.lightningDamage.max.val());
        this.player.offence.spell.chaos.min.dec(this.chaosDamage.min.val());
        this.player.offence.spell.chaos.max.dec(this.chaosDamage.max.val());
        this.player.offence.spell.speed.dec(this.speed.val());
        this.player.offence.spell.crtRate.dec(this.crtRate.val());
      }
    }
  }
}
