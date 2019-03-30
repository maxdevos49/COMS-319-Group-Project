import { Namespace, Server, Socket } from "socket.io";
import { PlayerUpdate } from "../public/javascript/models/games/PlayerUpdate";
import v1Gen from "uuid/v1";

export class GameServer {
    /**
     * The unique server id which identifies this server and is used in it's routes
     */
    public serverId: string;
    /**
     * The socket io room this game is listening to
     */
    private gameSocket: Namespace;
    /**
     * The clients that are connected to this server
     */
    private clients: Map<string, Socket>;
    /**
     * The map of every client id to their name
     */
    private playerNames: Map<string, string>;

    constructor(serverSocket: Server) {
        this.clients = new Map<string, Socket>();
        this.playerNames = new Map<string, string>();

        this.serverId = v1Gen();
        this.gameSocket = serverSocket.of("/games/" + this.serverId);

        this.gameSocket.on("connection", (socket: Socket) => {
            console.debug("A new client has connected to game: " + this.serverId);
            let newClientId: string = v1Gen();

            // Send the new client their id
            socket.emit("/update/assignid", newClientId);

            // Set the clients name when that update is received
            socket.on("/update/assignname", (name: string) => {
                // Inform every other connected player that a new player has connected and inform new player of the existing players
                let newPlayerUpdate = new PlayerUpdate(newClientId, name);

                this.clients.forEach((playerSocket: Socket, playerId: string) => {
                    // Inform the old player of the new player
                    playerSocket.emit("/update/playerupdate", newPlayerUpdate);
                    // Inform the new player of the old player
                    socket.emit(
                        "/update/playerupdate",
                        new PlayerUpdate(playerId, this.playerNames.get(playerId))
                    );
                });

                // Handshake is complete, add new client
                this.clients.set(newClientId, socket);
                this.playerNames.set(newClientId, name);

                socket.emit("/update/begingame");
            });
        });
    }
}
