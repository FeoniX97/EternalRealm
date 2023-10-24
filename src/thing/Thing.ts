import { Clock } from "colyseus";
import Event from "../event/Event";
import EventListener from "../event/EventListener";
import EventSender from "../event/EventSender";
import { db } from "../app.config";
import { ObjectId } from "mongodb";

export interface Options {
  /** the unique name in each Thing which is the field in DB and to receive action from client */
  entityID?: string;
  /** the room clock of Colyseus */
  clock?: Clock;
  /** the data read from DB */
  json?: any;
  /** the `collection` name of this Thing in the DB, `id` also need to set for persistance storage */
  collection?: string;
  /** the `id` of this Thing in the DB, `collection` name also need to set for persistance storage  */
  id?: string;
  /** is this Thing the root of the Thing tree? (Is it the most top ancestor?) */
  isRoot?: boolean;
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

  /** the most top ancestor Thing, normally refer to the top document for DB */
  readonly root: Thing;
  readonly parent: Thing;
  readonly children: Array<Thing> = [];

  /** the custom ID which is used to receive action from client */
  readonly entityID: string;

  /** the room clock of Colyseus */
  clock: Clock;

  /** the `id` of this Thing in the DB, `collection` name also need to set for persistance storage  */
  id?: string;

  /** the `collection` name of this Thing in the DB, `id` also need to set for persistance storage */
  collection?: string;

  /** the list of actions executable by client */
  readonly actions: Action[] = [];

  constructor(parent: Thing, options?: Options) {
    if (parent?.root) this.root = parent?.root;
    else this.root = options?.isRoot ? this : null;

    this.parent = parent;

    // id and collection only for roots
    if (options?.isRoot) {
      this.id = options?.id;
      this.collection = options?.collection;
    }

    this.entityID = options?.entityID;
    this.clock = options?.clock;

    this.parent?.children.push(this);
    this.parent?.hookEvent(this);

    this.populateFromDB(options);
  }

  /***************************** BEGIN Events ************************/
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

  /***************************** BEGIN Actions ************************/
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
      if (child.entityID && child.entityID === headEntity) child.onAction(restEntities, payload, onError);
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

  /***************************** BEGIN Room ************************/
  /** set the clock in frontend room, will propagate down to all children */
  setClock(clock: Clock) {
    this.clock = clock;

    this.children.forEach((child) => child.setClock(clock));
  }

  /** unhook all listeners here */
  protected onDestroy() {
    this.children.forEach((child) => child.onDestroy());
  }

  /***************************** BEGIN Database ************************/
  /** convert this thing into JSON which is used to store into DB
   * @param reference whether only return the DB id of this Thing, only applicable for root Thing
   */
  toJSON(reference?: boolean) {
    if (reference) {
      if (!this.id) throw new Error("failed to convert toJSON with idOnly, the target Thing has no id!");
      if (!this.collection) throw new Error("failed to convert toJSON with idOnly, the target Thing has no collection name!");
      if (this.root !== this) throw new Error("failed to convert toJSON with idOnly, the target Thing is not the root!");

      return {
        id: this.id,
        collection: this.collection,
      };
    }

    if (this.children.length <= 0) return null;

    let data: any = {};

    for (let child of this.children) {
      if (child.entityID) {
        data[child.entityID] = child.toJSON();
      }
    }

    return data;
  }

  /** read the object in DB and call the onPopulated callback */
  protected async populateFromDB(options?: Options) {
    // return the options directly if no persistance
    if (!this.collection) {
      this.onPopulated(options);
      return;
    }

    if (this.id) {
      let data = await db.collection(this.collection).findOne({ _id: new ObjectId(this.id) });
      options.json = data;
    }

    this.onPopulated(options);

    // create a new object in DB if id is not provided
    if (!this.id) await this.saveToDB();
  }

  /** save the root object to DB */
  protected async saveToDB() {
    if (!this.root) throw new Error("failed to save to DB, no root is specified");
    if (!this.root.collection) return;

    // create a new object in DB if id is not provided
    if (!this.root.id) {
      const result = await db.collection(this.root.collection).insertOne(this.root.toJSON());
      this.root.id = result.insertedId.toString();
      return;
    }

    // update the object in DB
    await db.collection(this.root.collection).updateOne({ _id: new ObjectId(this.root.id) }, { $set: this.root.toJSON() });
  }

  /** parse the json data and remove some options that's exclusive to the root and parent */
  protected parseOptions(parentOptions?: Options): any {
    // remove options thats exclusive to the root
    delete parentOptions["id"];
    delete parentOptions["collection"];
    delete parentOptions["isRoot"];

    // remove option thats exclusive to the parent
    delete parentOptions["entityID"];

    // remove options that is null or undefined
    let o: keyof typeof parentOptions;
    for (o in parentOptions) {
      if (parentOptions[o] === null || parentOptions[o] === undefined) {
        delete parentOptions[o];
      }
    }

    if (!this.entityID) return parentOptions;

    let data = parentOptions?.json?.[this.entityID];

    return { ...parentOptions, json: data };
  }

  /** the data is ready, implement this method to create children, hook events etc... */
  protected onPopulated(options?: Options) {}
}

export class ActionEvent extends Event {
  constructor(sender: Thing) {
    super(sender);
  }
}
