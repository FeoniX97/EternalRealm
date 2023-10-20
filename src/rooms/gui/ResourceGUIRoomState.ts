import { type } from "@colyseus/schema";
import MySchema from "../MySchema";
import RangeValState from "../state/RangeValState";
import MyRoom from "../MyRoom";
import Player from "../../thing/living/character/player/Player";

export default class extends MySchema {
  player: Player;

  @type(RangeValState)
  life: RangeValState;

  @type(RangeValState)
  mana: RangeValState;

  @type(RangeValState)
  es: RangeValState;

  @type(RangeValState)
  exp: RangeValState;

  constructor(room: MyRoom<MySchema>, player: Player) {
    super(room);

    this.player = player;
  }
}
