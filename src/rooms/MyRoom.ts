import { Room } from "@colyseus/core";
import MySchema from "./MySchema";

export default abstract class MyRoom<T extends MySchema> extends Room<T> {}
