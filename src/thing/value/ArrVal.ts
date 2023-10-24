import { createThing } from "../../utils/utils";
import Thing, { Options } from "../Thing";

interface PopulateOptions<T extends Thing> {
  /** the count of Things to save in the list */
  count?: number;
  /** the callback to return the Thing to save in the list */
  onPopulate: (arrVal: ArrVal<T>, index: number) => T;
}

interface ArrValOptions<T extends Thing> extends Options {
  /** configuration to populate Things into the list */
  populate?: PopulateOptions<T>;
}

export default class ArrVal<T extends Thing> extends Thing {
  children: T[];

  constructor(parent: Thing, options?: ArrValOptions<T>) {
    super(parent, options);
  }

  protected onPopulated(options?: ArrValOptions<T>): void {
    if (!this.children) this.children = [];

    if (options?.json) {
     console.log(1);

     // populate the data array
     const first = options?.json?.[0];

     if (first) {
       const length = options?.json?.length;
       if (first.className) {
         // populate by reference
         for (let i = 0; i < length; i++) {
           createThing<T>(this, i.toString(), options?.json?.[i]);
         }
       } else {
         // populate by full JSON
         // to be implemented
       }
     }
   } else if (options.populate) {
      // populate by optionas
      for (let i = 0; i < (options.populate.count ?? 1); i++) {
        console.log(2);
        options.populate.onPopulate(this, i);
      }
    }
  }

  /**
   * add the Thing to the list
   * @param callback `index` is the new index to be store in the Thing as the entityID
   */
  add(callback: (index: number) => T) {
    callback(this.children.length);
  }

  get(index: number) {
    return this.children[index];
  }

  toJSON() {
    return this.children.map((child) => child.toJSON());
  }
}
