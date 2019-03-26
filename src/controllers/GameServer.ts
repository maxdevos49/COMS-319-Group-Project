import { v1 } from "uuid/interfaces";
import { Namespace, Server, Socket } from "socket.io";
import { PlayerUpdate } from "../public/javascript/models/PlayerUpdate";
let v1Gen = require("uuid/v1");

export class GameServer {
    /**
     * The unique server id which identifies this server and is used in it's routes
     */
    public serverId: v1;
    /**
     * The socket io room this game is listening to
     */
    private gameSocket: Namespace;
    /**
     * The clients that are connected to this server
     */
    private clients: Map<v1, Socket>;
    /**
     * The map of every client id to their name
     */
    private playerNames: Map<v1, string>;

    constructor(serverSocket: Server) {
        this.clients = new Map<v1, Socket>();
        this.playerNames = new Map<v1, string>();

        this.serverId = v1Gen();
        this.gameSocket = serverSocket.of("/games/" + this.serverId);

        this.gameSocket.on("/connection", this.onConnection);
    }

    private onConnection(socket: Socket) {

        let newClientId: v1 = v1Gen();
        this.clients.set(newClientId, socket);

        // Send the new client their id
        socket.emit("/update/assignid", newClientId);

        // Set the clients name when that update is received
        socket.on("/update/assignname", (name: string) => {
            this.playerNames.set(newClientId, name);
            // Inform every other connected player that a new player has connected and inform new player of the existing players
            let newPlayerUpdate = new PlayerUpdate(newClientId, name);

            this.clients.forEach((playerSocket: Socket, playerId: v1) => {
                // Inform the old player of the new player
                playerSocket.emit("/update/playerupdate", newPlayerUpdate);
                // Inform the new player of the old player
                socket.emit(
                    "/update/playerupdate",
                    new PlayerUpdate(playerId, this.playerNames.get(playerId))
                );
            });
        });
        
    }
}
