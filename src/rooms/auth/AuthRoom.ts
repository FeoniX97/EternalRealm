import { Room, Client, ClientArray, ServerError } from "@colyseus/core";
import { AuthRoomState } from "./AuthRoomState";
import { db, server } from "../../app.config";
import { CharacterPanelRoom } from "../panel/CharacterPanelRoom";
import Character from "../../thing/living/character/Character";

export class AuthRoom extends Room<AuthRoomState> {
  onCreate(options: any) {
    this.setState(new AuthRoomState());

    // this.onMessage("*", (client, type, message) => {
    //   console.log("type: " + type);
    //   console.log("message: " + message)
    // });
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
    const character = new Character(null, { clock: this.clock });

    // define rooms for the player using the playerID as token
    server.define("character_panel_room_" + token, CharacterPanelRoom, {
      token,
      character,
    });

    client.send("token", token);
  }
}
