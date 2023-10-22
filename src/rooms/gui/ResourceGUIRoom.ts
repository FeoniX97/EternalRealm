import Player from "../../thing/living/character/player/Player";
import MyRoom from "../MyRoom";
import ResourceGUIRoomState from "./ResourceGUIRoomState";

export default class extends MyRoom<ResourceGUIRoomState> {
  player: Player;

  onCreate({ token, player }: { token: string, player: Player }) {
    super.onCreate({ player });

    this.maxClients = 1;

    this.token = token;
    this.player = player;

    this.setState(new ResourceGUIRoomState(this, player));
  }
}
