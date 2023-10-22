import { Room } from "@colyseus/core";
import MySchema from "./MySchema";

export default abstract class MyRoom<T extends MySchema> extends Room<T> {
  protected token: string;

  onCreate(options: any): void | Promise<any> {
    this.onMessage("action", (client, message) => {
      this.state.onAction(message.entities, message, (errCode, message) => {
        client.send("error", { errCode, message });
      });
    });
  }

  // async onAuth(client: any, options: any, request: any) {
  //   if (this.clients.length > 0) return false;

  //   return authenticateRoom(options, this.token);
  // }
}