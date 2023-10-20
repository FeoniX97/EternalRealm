import { Room, Client, ClientArray, ServerError } from "@colyseus/core";
import { AuthRoomState } from "./AuthRoomState";
import { db, server } from "../../app.config";
import { CharacterPanelRoom } from "../panel/character/CharacterPanelRoom";
import Character from "../../thing/living/character/Character";
import Player from "../../thing/living/character/player/Player";
import InventoryPanelRoom from "../panel/inventory/InventoryPanelRoom";
import ResourceGUIRoom from "../gui/ResourceGUIRoom";

export class AuthRoom extends Room<AuthRoomState> {
  onCreate(options: any) {
    this.setState(new AuthRoomState());

    // this.onMessage("*", (client, type, message) => {
    //   console.log("type: " + type);
    //   console.log("message: " + message)
    // });
  }

  async onAuth(client: any, options: any, request: any) {
    console.log('joining auth room, verifying id');

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
    console.log('joined auth room');

    const token = player.id;

    // create player character instance
    const playerInstance = new Player(null, { clock: this.clock });

    // define rooms for the player using the playerID as token
    server.define("character_panel_room_" + token, CharacterPanelRoom, {
      token,
      player: playerInstance,
    });

    server.define("inventory_panel_room_" + token, InventoryPanelRoom, {
      token,
      inventory: playerInstance.inventory,
    });

    server.define("resource_gui_panel_room_" + token, ResourceGUIRoom, {
      token,
      player: playerInstance,
    });

    client.send("token", token);
  }

  onLeave(client: Client<this["clients"] extends ClientArray<infer U, any> ? U : never, this["clients"] extends ClientArray<infer _, infer U> ? U : never>, consented?: boolean): void | Promise<any> {
      console.log('leaving auth room');
  }
}
