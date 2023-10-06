import { Room, Client } from "@colyseus/core";
import { ResourceHUDRoomState } from "./ResourceHUDRoomState";
import Character from "../../thing/living/character/Character";
import { authenticateRoom } from "../util/utils";

export class ResourceHUDRoom extends Room<ResourceHUDRoomState> {
  token: string;
  character: Character;

  onCreate({ token, character }: { token: string; character: Character }) {
    this.maxClients = 1;

    this.token = token;
    this.character = character;

    this.setState(new ResourceHUDRoomState(character));

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  async onAuth(client: any, options: any, request: any) {
    return authenticateRoom(options, this.token);
  }

  async onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined " + this.roomName + "!", options);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left " + this.roomName + "!");
  }

  onDispose() {
    console.log("room", this.roomName, "disposing...");
  }
}
