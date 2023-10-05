import { Room, Client, ClientArray, ServerError } from "@colyseus/core";
import { AuthRoomState } from "./AuthRoomState";
import { IncomingMessage } from "http";
import { db, server } from "../../app.config";
import { ResourceHUDRoom } from "../resourceHUD/ResourceHUDRoom";

export class AuthRoom extends Room<AuthRoomState> {
  onCreate(options: any) {
    this.setState(new AuthRoomState());

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  async onAuth(
    client: Client<
      this["clients"] extends ClientArray<infer U, any> ? U : never,
      this["clients"] extends ClientArray<infer _, infer U> ? U : never
    >,
    options: any,
    request?: IncomingMessage
  ) {
    let playerDoc = await db.collection("players").findOne({
      username: options.username,
      password: options.password,
    });

    if (playerDoc) {
      return {...playerDoc, id: playerDoc._id.toString()};
    } else {
      throw new ServerError(400, "用户名或密码错误！");
    }
  }

  async onJoin(client: Client, options: any, auth: any) {
    console.log(client.sessionId, "joined!", auth);

    // define rooms for the player
    // server.define("resourceHUD_room_" + player.username, ResourceHUDRoom);

    client.send("token", auth.id);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
