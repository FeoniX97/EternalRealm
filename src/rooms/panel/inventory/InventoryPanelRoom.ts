import Inventory from "../../../thing/living/character/player/Inventory";
import MyRoom from "../../MyRoom";
import InventoryPanelRoomState from "./InventoryPanelRoomState";

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
}
