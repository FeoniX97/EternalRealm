import { Schema } from "@colyseus/schema";
import Event from "../event/Event";
import EventListener from "../event/EventListener";
import EventSender from "../event/EventSender";

export default abstract class Thing
  extends Schema
  implements EventSender, EventListener
{
  eventListeners: Array<EventListener> = [];

  readonly parent: Thing;

  constructor(parent: Thing) {
    super();

    this.parent = parent;
    this.parent?.hookEvent(this);
  }

  /** inform parent state that the child state has changed */
  onStateChanged() {
    this.parent?.onStateChanged();
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

  onEventAfter(event: Event): void {
    // send the received events to all hooked listeners also
    for (let eventListener of this.eventListeners) {
      eventListener.onEventAfter(event);
    }
  }
}
