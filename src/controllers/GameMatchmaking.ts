import * as http from "http";
import {Server} from "socket.io";
import {GameServer} from "./GameServer";
let socketIO = require("socket.io");

export class GameMatchmaking {
    /**
     * The socket namespace used by
     */
    gameSocket: Server;
    /**
     * The list of active games in the server
     */
    games: GameServer[];

    constructor(server: http.Server) {
        this.games = [];
        // Create the socket server
        this.gameSocket = socketIO(server);
        // TODO: Implement smart game begin/end
        this.games.push(new GameServer(this.gameSocket));
        console.log("A game server has begun with id: " + this.games[0].serverId);
    }
}