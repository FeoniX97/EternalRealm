import { ArraySchema } from "@colyseus/schema";
import Inventory from "../../../thing/living/character/player/Inventory";
import MyRoom from "../../MyRoom";
import InventoryPanelRoomState, { ItemState } from "./InventoryPanelRoomState";

export default class InventoryPanelRoom extends MyRoom<InventoryPanelRoomState> {
  token: string;
  inventory: Inventory;

  onCreate({ token, inventory }: { token: string; inventory: Inventory }) {
    super.onCreate({ token, inventory });

    this.maxClients = 1;

    this.token = token;
    this.inventory = inventory;

    this.setState(new InventoryPanelRoomState(this, inventory));
  }

  rebuildState(): void {
    this.state.items.forEach((item) => item.onDispose());
    this.state.items.clear();
    this.state.items = new ArraySchema<ItemState>();

    for (let item of this.inventory.items) {
      this.state.items.push(new ItemState(this, item));
    }
  }
}
