import { Room, Client, ServerError } from "@colyseus/core";
import { AuthRoomState } from "./AuthRoomState";
import { db, server } from "../../app.config";
import { CharacterPanelRoom } from "../panel/character/CharacterPanelRoom";
import Player from "../../thing/living/character/player/Player";
import InventoryPanelRoom from "../panel/inventory/InventoryPanelRoom";
import ResourceGUIRoom from "../gui/ResourceGUIRoom";

export class AuthRoom extends Room<AuthRoomState> {
  onCreate(options: any) {
    this.setState(new AuthRoomState());
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
    console.log("joined auth room");

    const token = player.id + client.sessionId;

    // create player character instance
    const playerInstance = new Player(null, { id: player.id, collection: "players", isRoot: true, clock: this.clock });
    // const playerInstance = new Player(null, { isRoot: true, clock: this.clock });
    // console.log(JSON.stringify(playerInstance.toJSON()));

    // define rooms for the player
    server.define("character_panel_room_" + token, CharacterPanelRoom, {
      token,
      player: playerInstance,
    });

    // server.define("inventory_panel_room_" + token, InventoryPanelRoom, {
    //   token,
    //   inventory: playerInstance.inventory,
    // });

    server.define("resource_gui_room_" + token, ResourceGUIRoom, {
      token,
      player: playerInstance,
    });

    // send the token back to client
    client.send("token", token);
  }
}
