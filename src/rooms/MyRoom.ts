import { Room } from "@colyseus/core";
import MySchema from "./MySchema";

export default abstract class MyRoom<T extends MySchema> extends Room<T> {
  abstract rebuildState(sender?: MySchema): void;

  onCreate(options: any): void | Promise<any> {
    this.onMessage("action", (client, message) => {
      this.state.onAction(message.entities, message, (errCode, message) => {
        client.send("error", { errCode, message });
      });
    });
  }
}
