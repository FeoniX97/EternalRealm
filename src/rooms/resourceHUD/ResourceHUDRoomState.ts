import { Schema, type } from "@colyseus/schema";
import Character from "../../thing/living/character/Character";

export class ResourceHUDRoomState extends Schema {
  character: Character;

  @type("int32") lifeMin: number;
  @type("int32") lifeMax: number;

  constructor(character: Character) {
    super();

    this.character = character;

    this.lifeMin = character.lifeMin;
    this.lifeMax = character.lifeMax;
  }
}
