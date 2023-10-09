import { Schema } from "@colyseus/schema";
import EventListener from "../event/EventListener";
import EventSender from "../event/EventSender";
import Event from "../event/Event";
import MyRoom from "./MyRoom";

export default abstract class MySchema extends Schema implements EventListener, EventSender {
  eventListeners: Array<EventListener> = [];

  room: MyRoom<MySchema>

  constructor(room: MyRoom<MySchema>) {
    super();

    this.room = room;
  }

  hookEvent(...eventSenders: EventSender[]): void {
    for (let eventSender of eventSenders) {
      const exists = eventSender.eventListeners.find(
        (listener) => listener === this
      );

      if (!exists) eventSender.eventListeners.push(this);
    }
  }

  unhookEvent(...eventSenders: EventSender[]): void {
    for (let eventSender of eventSenders) {
      eventSender.eventListeners = eventSender.eventListeners.filter(
        (listener) => listener != this
      );
    }
  }

  onEventBefore(event: Event): boolean {
    return false;
  }

  onEventAfter(event: Event): void {}

  /**
   * on receiving action from client, override this method to handle action
   * @param entities the child entities to receive the action, goes down all the way to the last entity
   * @param payload the payload json
   * @param onError the callback function to send error message back to client
   */
  onAction(entities: string, payload: any, onError: (errCode: string, message: string) => void) {}
}
