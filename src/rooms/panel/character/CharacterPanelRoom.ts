import { CharacterPanelRoomState } from "./CharacterPanelRoomState";
import MyRoom from "../../MyRoom";
import Player from "../../../thing/living/character/player/Player";

export class CharacterPanelRoom extends MyRoom<CharacterPanelRoomState> {
  token: string;
  player: Player;

  onCreate({ token, player }: { token: string; player: Player }) {
    super.onCreate({ token, player });

    this.maxClients = 1;

    this.token = token;
    this.player = player;

    this.setState(new CharacterPanelRoomState(this, player));
  }

  // async onAuth(client: any, options: any, request: any) {
  //   if (this.clients.length > 0) return false;

  //   return authenticateRoom(options, this.token);
  // }
}
