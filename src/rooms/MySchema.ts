import { Schema } from "@colyseus/schema";
import EventListener from "../event/EventListener";
import EventSender from "../event/EventSender";
import Event from "../event/Event";

export default abstract class MySchema extends Schema implements EventListener {
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
}
