import { type } from "@colyseus/schema";
import MySchema from "../MySchema";
import RangeValState from "../state/RangeValState";
import MyRoom from "../MyRoom";
import Player from "../../thing/living/character/player/Player";

export default class ResourceGUIRoomState extends MySchema {
  player: Player;

  @type(RangeValState)
  es: RangeValState;

  @type(RangeValState)
  life: RangeValState;

  @type(RangeValState)
  mana: RangeValState;

  @type(RangeValState)
  exp: RangeValState;

  constructor(room: MyRoom<ResourceGUIRoomState>, player: Player) {
    super(room);

    this.player = player;

    this.es = new RangeValState(player.resource.es, room);
    this.life = new RangeValState(player.resource.life, room);
    this.mana = new RangeValState(player.resource.mana, room);
    this.es = new RangeValState(player.resource.es, room);
    this.exp = new RangeValState(player.exp, room);
  }
}
