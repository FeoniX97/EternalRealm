import ThingFactory from "../../utils/ThingFactory";
import Thing, { Options } from "../Thing";

interface ArrValOptions<T extends Thing> extends Options {
  /** configuration to populate Things into the list */
  populate?: PopulateOptions<T>;
}

interface PopulateOptions<T extends Thing> {
  /** the count of Things to save in the list */
  count?: number;
  /** the callback to return the default Thing instances to save in the list if theres no data in the JSON */
  onPopulate?: (arrVal: ArrVal<T>, options?: ArrValOptions<T>) => T;
  /** the callback when each instance is populated finish in the list by the JSON data */
  onPopulated?: (arrVal: ArrVal<T>, thing: T, options?: Options) => void;
}

export default class ArrVal<T extends Thing> extends Thing {
  children: T[];

  constructor(parent: Thing, options?: ArrValOptions<T>) {
    super(parent, options);
  }

  protected onPopulated(options?: ArrValOptions<T>): void {
    if (!this.children) this.children = [];

    if (options?.json && options?.json?.length > 0) {
      if (!options?.populate) return;

      // populate the JSON data array
      const first = options?.json?.[0];

      if (first) {
        const length = options?.json?.length;
        if (first.className) {
          // populate by reference
          for (let i = 0; i < length; i++) {
            ThingFactory.createThing<T>(this, i.toString(), {
              id: options?.json?.[i]?.id,
              collection: options?.json?.[i]?.collection,
              className: options?.json?.[i]?.className,
              onPopulated: (thing: Thing, _options: Options) => options?.populate?.onPopulated?.(this, thing as T, _options),
              ...options,
            });
          }
        } else {
          // populate by full JSON
          // to be implemented
        }
      }
    } else if (options?.populate?.onPopulate) {
      // populate default Things by options
      for (let i = 0; i < (options.populate.count ?? 1); i++) {
        options.populate.onPopulate(this, { entityID: i.toString(), onPopulated: (thing, _options) => options?.populate?.onPopulated?.(this, thing as T, _options), ...options });
      }
    }
  }

  /**
   * add the Thing to the list
   * @param callback `index` is the new size of the array, to be store in the Thing as the entityID
   */
  add(callback: (index: number) => T) {
    let newSize = this.children.length + 1;

    this.children.push(callback(newSize));
  }

  get(index: number) {
    return this.children[index];
  }

  toJSON() {
    return this.children.map((child) => child.toJSON());
  }
}
