export default class Rarity {
 name: string;
 value: number;

 constructor(name: string, value: number) {
  this.name = name;
  this.value = value;
 }

 static normal: Rarity = new Rarity('普通', 0);
 static magic: Rarity = new Rarity('精良', 1);
 static rare: Rarity = new Rarity('稀有', 2);
 static mythical: Rarity = new Rarity('史诗', 3);
 static unique: Rarity = new Rarity('独特', 4);
}