import { Room } from "@colyseus/core";
import MySchema from "./MySchema";

export default abstract class MyRoom<T extends MySchema> extends Room<T> {
  abstract rebuildState(sender?: T): void;

  onCreate(options: any): void | Promise<any> {
    this.onMessage("*", (client, type, message) => {
      this.state.onAction(type as string, message, (errCode, message) => {
        client.send("error", { errCode, message });
      });
    });
  }
}
