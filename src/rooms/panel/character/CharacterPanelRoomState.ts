import { type } from "@colyseus/schema";
import MySchema from "../../MySchema";
import NumValState from "../../state/NumValState";
import MyRoom from "../../MyRoom";
import RangeValState from "../../state/RangeValState";
import { Attack, Damage } from "../../../thing/living/stats/Offence";
import Player from "../../../thing/living/character/player/Player";

class DamageState extends MySchema {
  @type(RangeValState)
  fire: RangeValState;

  @type(RangeValState)
  cold: RangeValState;

  @type(RangeValState)
  lightning: RangeValState;

  @type(RangeValState)
  chaos: RangeValState;

  @type(NumValState)
  speed: NumValState;

  @type(NumValState)
  crtRate: NumValState;

  constructor(damage: Damage, room: MyRoom<MySchema>) {
    super(room);

    this.fire = new RangeValState(damage.fire, room);
    this.cold = new RangeValState(damage.cold, room);
    this.lightning = new RangeValState(damage.lightning, room);
    this.chaos = new RangeValState(damage.chaos, room);
    this.speed = new NumValState(damage.speed, room);
    this.crtRate = new NumValState(damage.crtRate, room);
  }
}

export class AttDamageState extends DamageState {
  @type(RangeValState)
  physical: RangeValState;

  constructor(damage: Attack, room: MyRoom<MySchema>) {
    super(damage, room);

    this.physical = new RangeValState(damage.physical, room);
  }
}

export class SpellDamageState extends DamageState {}

export class CharacterPanelRoomState extends MySchema {
  player: Player;

  @type(NumValState)
  level: NumValState;

  @type(RangeValState)
  exp: RangeValState;

  @type(RangeValState)
  life: RangeValState;

  @type(RangeValState)
  mana: RangeValState;

  @type(RangeValState)
  es: RangeValState;

  @type(NumValState)
  str: NumValState;

  @type(NumValState)
  agi: NumValState;

  @type(NumValState)
  int: NumValState;

  @type(NumValState)
  unallocated: NumValState;

  @type(NumValState)
  accuracyRating: NumValState;

  @type(NumValState)
  crtDamage: NumValState;

  @type(AttDamageState)
  attack: AttDamageState;

  @type(SpellDamageState)
  spell: SpellDamageState;

  @type(NumValState)
  armour: NumValState;

  @type(NumValState)
  evasionRating: NumValState;

  @type(NumValState)
  blockRate: NumValState;

  @type(NumValState)
  phyResistance: NumValState;

  @type(NumValState)
  fireResistance: NumValState;

  @type(NumValState)
  coldResistance: NumValState;

  @type(NumValState)
  lightningResistance: NumValState;

  @type(NumValState)
  chaosResistance: NumValState;

  constructor(room: MyRoom<CharacterPanelRoomState>, player: Player) {
    super(room);

    this.player = player;

    this.level = new NumValState(player.level, room);
    this.exp = new RangeValState(player.exp, room);
    this.life = new RangeValState(player.resource.life, room);
    this.mana = new RangeValState(player.resource.mana, room);
    this.es = new RangeValState(player.resource.es, room);
    this.str = new NumValState(player.core.str, room);
    this.agi = new NumValState(player.core.agi, room);
    this.int = new NumValState(player.core.int, room);
    this.unallocated = new NumValState(player.core.unallocated, room);
    this.accuracyRating = new NumValState(player.offence.accuracyRating, room);
    this.crtDamage = new NumValState(player.offence.crtDamage, room);
    this.attack = new AttDamageState(player.offence.attack, room);
    this.spell = new SpellDamageState(player.offence.spell, room);
    this.armour = new NumValState(player.defence.armour, room);
    this.evasionRating = new NumValState(player.defence.evasionRating, room);
    this.blockRate = new NumValState(player.defence.blockRate, room);
    this.phyResistance = new NumValState(player.defence.resistance.physical, room);
    this.fireResistance = new NumValState(player.defence.resistance.fire, room);
    this.coldResistance = new NumValState(player.defence.resistance.cold, room);
    this.lightningResistance = new NumValState(player.defence.resistance.lightning, room);
    this.chaosResistance = new NumValState(player.defence.resistance.chaos, room);
  }

  onAction(entities: string, payload: any, onError: (errCode: string, message: string) => void): void {
    this.player.onAction(entities, payload, onError);
  }
}
