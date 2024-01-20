import { Clock, Delayed } from "colyseus";
import Event from "../event/Event";
import EventListener from "../event/EventListener";
import EventSender from "../event/EventSender";
import { db } from "../app.config";
import { ObjectId } from "mongodb";
import gameConstant from "../utils/gameConstant";

export interface Options {
  /** the unique name in each Thing which is the field in DB and to receive action from client */
  entityID?: string;
  /** the room clock of Colyseus */
  clock?: Clock;
  /** the data to populate, either read from DB or taken from default */
  json?: any;
  /** the `collection` name of this Thing in the DB, `id` also need to set for persistance storage */
  collection?: string;
  /** the class name of this Thing to populate from DB */
  className?: string;
  /** the `id` of this Thing in the DB, `collection` name also need to set for persistance storage  */
  id?: string;
  /** the callback to listen when the Thing is populated finish */
  onPopulated?: (self: Thing, options?: Options) => void;
  /** helps for debugging when identifying the correct Thing */
  tag?: string;
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

  /** helps for debugging when identifying the correct Thing */
  tag?: string;

  /** the timeout left to insert/update DB by calling `actualSaveToDB()`, will be set for the first invoking Thing, then will be cleared after the timeout
   * @ in short, save to DB only after a fixed timeout after the first request is received
   * @NOTE only applicable to Thing with collection
   */
  private dbTimeout?: Delayed;

  /** the `collection` name of this Thing in the DB, `id` also need to set for persistance storage\
   * a Thing with `collection` is automatically consider as the root, a root can be embedded in another root (e.g. Item in Player's Inventory)
   */
  readonly collection?: string;

  /** the class name of this Thing to populate from DB */
  readonly className?: string;

  /** the list of actions executable by client */
  readonly actions: Action[] = [];

  /** the callback to listen when the Thing is populated finish, used when creating object */
  protected readonly onPopulatedCallback?: (self: Thing, options?: Options) => void;

  /** to be used by isPopulated(), used to check whether this Thing is populated finish after the object has been created */
  protected populatedPromise?: Promise<void>;

  constructor(parent: Thing, options?: Options) {
    if (parent) {
      if (parent.collection) this.root = parent;
      else this.root = parent.root;
    }

    this.parent = parent;

    // considered as a root Thing if having a collection name
    if (options?.collection) {
      this.id = options?.id;
      this.collection = options?.collection;
    }

    this.className = options?.className ?? this.constructor.name;
    this.tag = options?.tag;
    this.entityID = options?.entityID;
    this.clock = options?.clock ?? this.parent.clock;

    if (this.parent?.tag === "ArrVal") this.entityID = this.parent.children.length.toString();

    this.parent?.children.push(this);
    this.parent?.hookEvent(this);

    this.onPopulatedCallback = options?.onPopulated;
    this.populateFromDB(this.parseOptions(options));
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
  onDestroy() {
    this.children.forEach((child) => child.onDestroy());
  }

  /***************************** BEGIN Database ************************/
  /** convert this thing into JSON which is used to store into DB
   * @param full whether to force return the full json data instead of reference
   */
  toJSON(full = false) {
    // convert to a reference JSON if this Thing has another root and collection
    if (!full && this.root && this.root !== this && this.collection) {
      if (!this.id) throw new Error("failed to convert to JSON with reference, the target Thing has no id!");
      if (!this.collection) throw new Error("failed to convert to JSON with reference, the target Thing has no collection name!");

      return {
        id: this.id,
        collection: this.collection,
        className: this.className,
      };
    }

    let data: any = {};

    if (this.className) data.className = this.className;

    if (this.children.length <= 0) return data;

    for (let child of this.children) {
      if (child.entityID) {
        data[child.entityID] = child.toJSON();
      }
    }

    return data;
  }

  /** read the object in DB and call the onPopulated callback */
  protected async populateFromDB(options?: Options) {
    this.populatedPromise = new Promise(async (resolve, reject) => {
      // return the options directly if no persistance
      if (!this.collection) {
        this.onPopulated(options);
        this.onPopulatedCallback?.(this, options);
        resolve();
        return;
      }

      if (this.id) {
        let data = await db.collection(this.collection).findOne({ _id: new ObjectId(this.id) });
        options.json = data;
      }

      this.onPopulated(options);

      // create a new object in DB if id is not provided
      if (!this.id) await this.actualSaveToDB();

      this.onPopulatedCallback?.(this, options);
      resolve();
    });
  }

  /** to be called from external */
  saveToDB() {
    if (!this.collection) {
      if (this.root && this.root.collection) this.root.saveToDB();
      return;
    }

    if (!this.dbTimeout) {
      this.dbTimeout = this.clock.setTimeout(() => this.actualSaveToDB(), gameConstant.db.timeout);
      return;
    }
  }

  private async actualSaveToDB() {
    if (!this.collection) return;

    // create a new object in DB if id is not provided
    if (!this.id) {
      const result = await db.collection(this.collection).insertOne(this.toJSON(true));
      this.id = result.insertedId.toString();
      // inform the root to update self reference in the root with the new ID
      // if (this.root) {
      //   await this.root.saveToDB();
      // }
      return;
    }

    // update the object in DB
    await db.collection(this.collection).updateOne({ _id: new ObjectId(this.id) }, { $set: this.toJSON(true) });

    this.dbTimeout?.clear();
    this.dbTimeout = null;
  }

  protected parseOptions(parentOptions?: Options): any {
    // remove options thats exclusive to the root
    try {
      delete parentOptions["id"];
      delete parentOptions["collection"];
      delete parentOptions["className"];

      // remove option thats exclusive to the parent
      delete parentOptions["entityID"];
      delete parentOptions["onPopulated"];
      delete parentOptions["tag"];
    } catch (error) {}

    // remove options that is null or undefined
    let o: keyof typeof parentOptions;
    for (o in parentOptions) {
      if (parentOptions[o] === null || parentOptions[o] === undefined) {
        delete parentOptions[o];
      }
    }

    if (!this.entityID) return parentOptions;

    let data = parentOptions?.json?.[this.entityID] ?? parentOptions?.json?.[Number(this.entityID)];

    return { ...parentOptions, json: data };
  }

  /** the data is ready, implement this method to create children, hook events etc... */
  protected onPopulated(options?: Options) {}

  /** check whether this Thing is populated finish (e.g. load finish from DB) */
  isPopulated() {
    return this.populatedPromise;
  }
}

export class ActionEvent extends Event {
  constructor(sender: Thing) {
    super(sender);
  }
}
