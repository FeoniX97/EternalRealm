import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { MongoClient, ServerApiVersion, Db } from "mongodb";

/**
 * Import your Room files
 */
import { AuthRoom } from "./rooms/auth/AuthRoom";
import { Server } from "colyseus";
import { Log } from "./utils/utils";
import ResourceGUIRoom from "./rooms/gui/ResourceGUIRoom";
import Player from "./thing/living/character/player/Player";
import { CharacterPanelRoom } from "./rooms/panel/character/CharacterPanelRoom";
import InventoryPanelRoom from "./rooms/panel/inventory/InventoryPanelRoom";

const uri = "mongodb+srv://admin:yiwei7398138@cluster0.xi6ic.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export let db: Db;
export let server: Server;

export default config({
  initializeGameServer: async (gameServer) => {
    try {
      server = gameServer;

      // Connect the client to the server	(optional starting in v4.7)
      // client.connect();

      Log.success("Successfully connected to MongoDB");

      db = client.db("EternalRealm");

      // gameServer.onShutdown(async () => {
      //   if (client) {
      //     await client.close();
      //     Log.success("Successfully disconnected from MongoDB!");
      //   }
      // });
    } catch (err) {
      Log.error(err + "");
    }

    /**
     * Define your room handlers:
     */
    gameServer.define("auth_room", AuthRoom);
  },

  initializeExpress: (app) => {
    /**
     * Bind your custom express routes here:
     * Read more: https://expressjs.com/en/starter/basic-routing.html
     */
    app.get("/hello_world", (req, res) => {
      res.send("It's time to kick ass and chew bubblegum!");
    });

    /**
     * Use @colyseus/playground
     * (It is not recommended to expose this route in a production environment)
     */
    if (process.env.NODE_ENV !== "production") {
      app.use("/", playground);
    }

    /**
     * Use @colyseus/monitor
     * It is recommended to protect this route with a password
     * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
     */
    app.use("/colyseus", monitor());
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  },
});
