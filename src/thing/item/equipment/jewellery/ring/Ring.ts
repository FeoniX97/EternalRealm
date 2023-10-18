import Jewellery from "../Jewellery";

export default abstract class Ring extends Jewellery {
 onCreated(): void {
     super.onCreated();

     this.type = "戒指";
 }
}