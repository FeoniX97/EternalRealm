import { Room, Client, ClientArray, ServerError } from "@colyseus/core";
import { ResourceHUDRoomState } from "./ResourceHUDRoomState";
import { IncomingMessage } from "http";
import { db } from "../../app.config";

export class ResourceHUDRoom extends Room<ResourceHUDRoomState> {
  onCreate(options: any) {
    this.setState(new ResourceHUDRoomState());

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
      return playerDoc;
    } else {
      throw new ServerError(400, "用户名或密码错误！");
    }
  }

  async onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!", options);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
