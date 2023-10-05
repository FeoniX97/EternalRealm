import { Schema, type } from "@colyseus/schema";

export class ResourceHUDRoomState extends Schema {

  @type("int32") lifeMin: number;
  @type("int32") lifeMax: number;

}
