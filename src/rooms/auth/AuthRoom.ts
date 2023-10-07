import { Room, Client, ClientArray, ServerError } from "@colyseus/core";
import { AuthRoomState } from "./AuthRoomState";
import { IncomingMessage } from "http";
import { db, server } from "../../app.config";
import { ResourceHUDRoom } from "../resourceHUD/ResourceHUDRoom";
import Character from "../../thing/living/character/Character";

export class AuthRoom extends Room<AuthRoomState> {
  onCreate(options: any) {
    this.setState(new AuthRoomState());

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  async onAuth(client: any, options: any, request: any) {
    let playerDoc = await db.collection("players").findOne({
      username: options.username,
      password: options.password,
    });

    if (playerDoc) {
      return { ...playerDoc, id: playerDoc._id.toString() };
    } else {
      throw new ServerError(400, "用户名或密码错误！");
    }
  }

  async onJoin(client: Client, options: any, player: any) {
    const token = player.id;

    // create player character instance
    const character = new Character();

    // define rooms for the player using the playerID as token
    server.define("resourceHUD_room_" + token, ResourceHUDRoom, {
      token,
      character,
    });

    client.send("token", token);
  }
}
