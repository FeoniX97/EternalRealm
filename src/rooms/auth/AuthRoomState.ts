import { Schema, Context, type } from "@colyseus/schema";

export class AuthRoomState extends Schema {

  @type("string") mySynchronizedProperty: string = "Hello world";

}
