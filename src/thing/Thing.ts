import Event from "../event/Event";
import EventListener from "../event/EventListener";
import EventSender from "../event/EventSender";

export interface Options {
  /** the custom ID which is used to receive action from client */
  entityID?: string;
}

export default abstract class Thing implements EventSender, EventListener
{
  eventListeners: Array<EventListener> = [];

  readonly parent: Thing;
  readonly children: Array<Thing> = [];

  /** the custom ID which is used to receive action from client */
  readonly entityID: string;

  constructor(parent: Thing, options?: Options) {
    this.parent = parent;

    this.entityID = options?.entityID;
    this.parent?.children.push(this);
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

  /**
   * on receiving action from client, override this method to handle action
   * @param entities the child entities to receive the action, goes down all the way to the last entity
   * @param payload the payload json
   * @param onError the callback function to send error message back to client
   */
  onAction(entities: string, payload: any, onError: (errCode: string, message: string) => void) {
    // console.log(
    //   (this.entityID
    //     ? this.entityID
    //     : this.constructor.name) +
    //         " received action, child entities: " +
    //         entities +
    //         ", payload: " +
    //         payload
    // );

    this.passdownAction(entities, payload, onError);
  }

  /** pass down the action to targeted child */
  passdownAction(entities: string, payload: any, onError: (errCode: string, message: string) => void) {
    if (!entities) return;

    let entityArr = entities.split(".");
    let headEntity = entityArr[0];
    let restEntities: string;

    if (entityArr.length > 1) restEntities = entityArr.slice(1).join(".");

    this.children.forEach((child) => {
      if (
        child.entityID === headEntity ||
        child.constructor.name === headEntity
      )
        child.onAction(restEntities, payload, onError);
    });
  }
}
