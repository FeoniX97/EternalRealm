import { type } from "@colyseus/schema";
import Character from "../../../thing/living/character/Character";
import MySchema from "../../MySchema";
import NumValState from "../../state/NumValState";
import MyRoom from "../../MyRoom";
import RangeValState from "../../state/RangeValState";
import { Attack, Damage } from "../../../thing/living/stats/Offence";
import Event from "../../../event/Event";
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

    this.hookEvent(this.fire, this.cold, this.lightning, this.chaos, this.speed, this.crtRate);
  }

  onEventAfter(event: Event): void {
    this.fire.onDispose();
    this.cold.onDispose();
    this.lightning.onDispose();
    this.chaos.onDispose();
    this.speed.onDispose();
    this.crtRate.onDispose();

    this.room.rebuildState(this);
  }
}

export class AttDamageState extends DamageState {
  @type(RangeValState)
  physical: RangeValState;

  constructor(damage: Attack, room: MyRoom<MySchema>) {
    super(damage, room);

    this.physical = new RangeValState(damage.physical, room);
  }

  onEventAfter(event: Event): void {
    this.physical.onDispose();

    super.onEventAfter(event);
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

    room.clock.setTimeout(() => {
      room.rebuildState();
    }, 100);
  }

  onAction(entities: string, payload: any, onError: (errCode: string, message: string) => void): void {
    this.player.onAction(entities, payload, onError);
  }
}
