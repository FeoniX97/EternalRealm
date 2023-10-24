import Thing, { Options } from "./Thing";

export class RarityType {
  name: string;
  value: number;

  constructor(name: string, value: number) {
    this.name = name;
    this.value = value;
  }
}

interface RarityOptions extends Options {
  rarityType: RarityType;
}

export default class Rarity extends Thing {
  static Normal = new RarityType("普通", 0);
  static Magic = new RarityType("精良", 1);
  static Rare = new RarityType("稀有", 2);
  static Mythical = new RarityType("史诗", 3);
  static Unique = new RarityType("独特", 4);

  name: string;
  value: number;

  constructor(parent: Thing, options?: RarityOptions) {
    super(parent, options);
  }

  protected onPopulated(options?: RarityOptions): void {
    super.onPopulated(options);

    this.name = options?.json?.name ? options?.json?.name : options?.rarityType?.name ? options?.rarityType?.name : "普通";
    this.value = options?.json?.value ? options?.json?.value : options?.rarityType?.value ? options?.rarityType?.value : 0;
  }

  toJSON(reference?: boolean) {
    return {
      name: this.name,
      value: this.value,
    };
  }
}
