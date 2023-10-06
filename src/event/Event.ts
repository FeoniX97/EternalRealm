import EventSender from "./EventSender";

export default abstract class Event {
  sender: EventSender;
  blocked: boolean;

  constructor(sender: EventSender) {
    this.sender = sender;
  }

  /**
   * send this event object to all listeners of this event sender\
   * returns `true` if this event is blocked
   */
  sendEventBefore(): boolean {
    for (let eventListener of this.sender.eventListeners) {
      eventListener.onEventBefore(this);
    }

    return this.blocked;
  }

  sendEventAfter(): void {
    for (let eventListener of this.sender.eventListeners) {
      eventListener.onEventAfter(this);
    }
  }
}
