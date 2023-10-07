import { Schema } from "@colyseus/schema";
import EventSender from "../../event/EventSender";
import EventListener from "../../event/EventListener";
import Event from "../../event/Event";

export default abstract class State extends Schema implements EventListener {
  readonly parent: State;

  constructor(parent?: State) {
    super();

    this.parent = parent;
  }

  onStateChanged(callingState: State) {
    this.parent?.onStateChanged(callingState);
  }

  abstract onDispose(): void;

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
