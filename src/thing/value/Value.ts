import EventListener from "../../event/EventListener";
import EventSender from "../../event/EventSender";
import Thing from "../Thing";

export default abstract class Value extends Thing implements EventSender {
  eventListeners: Array<EventListener> = [];
}
