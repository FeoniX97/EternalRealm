import Player from "../../thing/living/character/player/Player";
import MyRoom from "../MyRoom";
import MySchema from "../MySchema";
import RangeValState from "../state/RangeValState";
import ResourceGUIRoomState from "./ResourceGUIRoomState";

export default class extends MyRoom<ResourceGUIRoomState> {
  player: Player;

  onCreate({ token, player }: { token: string; player: Player }) {
    super.onCreate({ token, player });

    this.maxClients = 1;

    this.token = token;
    this.player = player;

    this.setState(new ResourceGUIRoomState(this, player));
  }

  rebuildState(sender?: MySchema): void {
    this.state.life = new RangeValState(this.player.resource.life, this);
    this.state.mana = new RangeValState(this.player.resource.mana, this);
    this.state.es = new RangeValState(this.player.resource.es, this);
    this.state.exp = new RangeValState(this.player.exp, this);
  }
}
