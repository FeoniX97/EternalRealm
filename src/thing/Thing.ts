import { Clock } from "colyseus";
import Event from "../event/Event";
import EventListener from "../event/EventListener";
import EventSender from "../event/EventSender";

export interface Options {
  /** the custom ID which is used to receive action from client */
  entityID?: string;
  /** the room clock of Colyseus */
  clock?: Clock;
}

export interface ActionOptions {
  label?: string;
  events?: Event[];
  enabled?: boolean;
}

/**
 * The executable action of a Thing, callable by client\
 * The action class contains a `actionID` and `callback`
 * @param actionID the unique action name specified by client (e.g. 'use')
 * @param callback the callback function attached to this action, set by the receiver thing
 */
export class Action {
  id: string;
  callback: (payload: any) => void;
  label?: string;
  events: Event[];
  enabled = true;

  handleAction(thing: Thing, payload?: any, onError?: (errCode: string, errMessage: string) => void) {
    if (!this.enabled) return;
    
    // do pre check for all events of this action
    for (let event of this.events) {
      if (event.sendEventBefore()) {
        onError?.(event.errCode, event.errMessage);
        return;
      }
    }

    // call the action function
    this.callback({ ...payload, self: thing });

    // send all after events
    for (let event of this.events) {
      event.sendEventAfter();
    }

    // send action after event, for frontend UI change
    new ActionEvent(thing).sendEventAfter();

    // check is any event encounter error, and send errMessage back to client
    let errEvent = this.events.find((event) => event.errMessage);
    if (errEvent) onError?.(errEvent.errCode, errEvent.errMessage);

    // reset the errors of all events
    this.events.forEach((event) => {
      event.errCode = event.errMessage = null;
    });
  }

  constructor(id: string, callback: (payload: any) => void, options?: ActionOptions) {
    this.id = id;
    this.callback = callback;
    this.label = options?.label ?? id;
    this.events = options?.events ? options?.events : [];
    this.enabled = options?.enabled != null ? options?.enabled : true;
  }
}

export default abstract class Thing implements EventSender, EventListener {
  eventListeners: Array<EventListener> = [];

  readonly parent: Thing;
  readonly children: Array<Thing> = [];

  /** the custom ID which is used to receive action from client */
  readonly entityID: string;

  /** the room clock of Colyseus */
  readonly clock: Clock;

  /** the list of actions executable by client */
  readonly actions: Action[] = [];

  constructor(parent: Thing, options?: Options) {
    this.parent = parent;

    this.entityID = options?.entityID;
    this.clock = options?.clock;
    this.parent?.children.push(this);
    this.parent?.hookEvent(this);

    this.onCreated();
  }

  /** inform parent state that the child state has changed */
  onStateChanged() {
    this.parent?.onStateChanged();
  }

  hookEvent(...eventSenders: EventSender[]): void {
    for (let eventSender of eventSenders) {
      const exists = eventSender.eventListeners.find((listener) => listener === this);

      if (!exists) eventSender.eventListeners.push(this);
    }
  }

  unhookEvent(...eventSenders: EventSender[]): void {
    for (let eventSender of eventSenders) {
      eventSender.eventListeners = eventSender.eventListeners.filter((listener) => listener != this);
    }
  }

  onEventBefore(event: Event): boolean {
    return false;
  }

  /**
   * `note:` will not send after event to self to prevent infinite loop
   */
  onEventAfter(event: Event): void {
    // will not redirect events send by self, to prevent parent from receiving multiple duplicate events
    if (event.sender == this) return;

    // redirect the received events to all hooked listeners also
    for (let eventListener of this.eventListeners) {
      if (eventListener != this) eventListener.onEventAfter(event);
    }
  }

  /**
   * on receiving action from client, override this method to handle action
   * @param entities the child entities to receive the action, goes down all the way to the last entity
   * @param payload the payload json
   * @param onError the callback function to send error message back to client
   */
  onAction(entities: string, payload: any, onError: (errCode: string, message: string) => void) {
    if (entities == null) {
      // reached the target, execute the action
      this.executeAction(payload.action, payload, onError);
    } else {
      this.passdownAction(entities, payload, onError);
    }
  }

  /** pass down the action to targeted child */
  passdownAction(entities: string, payload: any, onError: (errCode: string, message: string) => void) {
    if (!entities) return;

    let entityArr = entities.split(".");
    let headEntity = entityArr[0];
    let restEntities: string;

    if (entityArr.length > 1) restEntities = entityArr.slice(1).join(".");

    this.children.forEach((child) => {
      if (child.entityID === headEntity || child.constructor.name === headEntity) child.onAction(restEntities, payload, onError);
    });
  }

  registerAction(id: string, callback: (payload: any) => void, options?: ActionOptions) {
    const exists = this.actions.find((action) => action.id === id);

    if (exists) {
      throw new Error("the registering action with id already exists: " + id);
    }

    this.actions.push(new Action(id, callback, options));
  }

  updateAction(id: string, newLabel: string, newCallback?: (payload: any) => void) {
    const target = this.actions.find((action) => action.id === id);

    if (!target) {
      throw new Error("failed to update action, the action with id does not exist: " + id);
    }

    target.label = newLabel;
    target.callback = newCallback ?? target.callback;
  }

  enableAction(id: string) {
    const target = this.actions.find((action) => action.id === id);

    if (!target) {
      throw new Error("failed to update action, the action with id does not exist: " + id);
    }

    target.enabled = true;
  }

  disableAction(id: string) {
    const target = this.actions.find((action) => action.id === id);

    if (!target) {
      throw new Error("failed to update action, the action with id does not exist: " + id);
    }

    target.enabled = false;
  }

  addActionEvent(id: string, event: Event) {
    const target = this.actions.find((action) => action.id === id);

    if (!target) {
      throw new Error("the registering action with id does not exist: " + id);
    }

    target.events.push(event);
  }

  executeAction(id: string, payload?: any, onError?: (errCode: string, message: string) => void) {
    const action = this.actions.find((_action) => _action.id === id);
    action?.handleAction(this, payload, onError);
  }

  /** initialize thing here (e.g. hook events), called after the base constructor\
   * do not read constructor values here as they might not be initialized\
   * do not set constructor values here as they might be overriden
   * */
  onCreated() {}

  /** unhook all listeners here */
  onDestroy() {
    this.children.forEach((child) => child.onDestroy());
  }
}

export class ActionEvent extends Event {
  constructor(sender: Thing) {
    super(sender);
  }
}
