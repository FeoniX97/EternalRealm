import { type } from "@colyseus/schema";
import Character from "../../thing/living/character/Character";
import MySchema from "../MySchema";
import Event from "../../event/Event";
import { NumChangeEvent } from "../../thing/value/NumVal";

export class ResourceHUDState extends MySchema {
  @type(Character)
  character: Character;

  constructor(character: Character) {
    super();

    this.character = character;
  }
}

export class ResourceHUDRoomState extends MySchema {
  character: Character;
  
  @type(ResourceHUDState) state: ResourceHUDState;

  constructor(character: Character) {
    super();

    this.character = character;
    this.state = new ResourceHUDState(character);

    this.hookEvent(character);
  }

  onEventAfter(event: Event): void {
    this.state = new ResourceHUDState(this.character);
  }
}
