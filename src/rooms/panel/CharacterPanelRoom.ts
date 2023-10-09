import { Client } from "@colyseus/core";
import {
  AttDamageState,
  CharacterPanelRoomState,
  SpellDamageState,
} from "./CharacterPanelRoomState";
import Character from "../../thing/living/character/Character";
import { authenticateRoom } from "../util/utils";
import MyRoom from "../MyRoom";
import NumValState from "../state/NumValState";
import RangeValState from "../state/RangeValState";
import MySchema from "../MySchema";

// action: player.character.core.str.inc
// payload: { playerID: string, characterID: string, inc: number }

export class CharacterPanelRoom extends MyRoom<CharacterPanelRoomState> {
  token: string;
  character: Character;

  onCreate({ token, character }: { token: string; character: Character }) {
    super.onCreate({ token, character });

    this.maxClients = 1;

    this.token = token;
    this.character = character;

    this.setState(new CharacterPanelRoomState(this, character));
  }

  async onAuth(client: any, options: any, request: any) {
    if (this.clients.length > 0) return false;

    return authenticateRoom(options, this.token);
  }

  async onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined " + this.roomName + "!", options);

    // this.clock.setTimeout(() => {
    //   this.state.level.value += 5;
    // }, 5000);
  }

  async rebuildState(sender?: MySchema) {
    if (sender == this.state.level || !sender)
      this.state.level = new NumValState(this.character.level, this);

    if (sender == this.state.exp || !sender)
      this.state.exp = new RangeValState(this.character.exp, this);

    if (sender == this.state.life || !sender)
      this.state.life = new RangeValState(this.character.resource.life, this);

    if (sender == this.state.mana || !sender)
      this.state.mana = new RangeValState(this.character.resource.mana, this);

    if (sender == this.state.es || !sender)
      this.state.es = new RangeValState(this.character.resource.es, this);

    if (sender == this.state.str || !sender)
      this.state.str = new NumValState(this.character.core.str, this);

    if (sender == this.state.agi || !sender)
      this.state.agi = new NumValState(this.character.core.agi, this);

    if (sender == this.state.int || !sender)
      this.state.int = new NumValState(this.character.core.int, this);

    if (sender == this.state.unallocated || !sender)
      this.state.unallocated = new NumValState(
        this.character.core.unallocated,
        this
      );

    if (sender == this.state.accuracyRating || !sender)
      this.state.accuracyRating = new NumValState(
        this.character.offence.accuracyRating,
        this
      );

    if (sender == this.state.crtDamage || !sender)
      this.state.crtDamage = new NumValState(
        this.character.offence.crtDamage,
        this
      );

    if (sender == this.state.attack || !sender)
      this.state.attack = new AttDamageState(
        this.character.offence.attack,
        this
      );

    if (sender == this.state.level || !sender)
      this.state.spell = new SpellDamageState(
        this.character.offence.spell,
        this
      );

    if (sender == this.state.armour || !sender)
      this.state.armour = new NumValState(this.character.defence.armour, this);

    if (sender == this.state.evasionRating || !sender)
      this.state.evasionRating = new NumValState(
        this.character.defence.evasionRating,
        this
      );

    if (sender == this.state.blockRate || !sender)
      this.state.blockRate = new NumValState(
        this.character.defence.blockRate,
        this
      );

    if (sender == this.state.phyResistance || !sender)
      this.state.phyResistance = new NumValState(
        this.character.defence.resistance.physical,
        this
      );

    if (sender == this.state.fireResistance || !sender)
      this.state.fireResistance = new NumValState(
        this.character.defence.resistance.fire,
        this
      );

    if (sender == this.state.coldResistance || !sender)
      this.state.coldResistance = new NumValState(
        this.character.defence.resistance.cold,
        this
      );

    if (sender == this.state.lightningResistance || !sender)
      this.state.lightningResistance = new NumValState(
        this.character.defence.resistance.lightning,
        this
      );

    if (sender == this.state.chaosResistance || !sender)
      this.state.chaosResistance = new NumValState(
        this.character.defence.resistance.chaos,
        this
      );
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left " + this.roomName + "!");
  }

  onDispose() {
    console.log("room", this.roomName, "disposing...");
  }
}
