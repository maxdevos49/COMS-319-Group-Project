import { Namespace, Server, Socket } from "socket.io";
import { GameServer, GameState } from "./GameServer";
import { PlayerInfo } from "../public/javascript/game/models/PlayerInfo";

export class GameMatchmaking {

    /**
     * The number of players needed in the matchmaking server for the game to start
     */
    public static numPlayerToStart: number = 4;

    /**
     * The root server socket of this server
     */
    serverSocket: Server;
    /**
     * The socket namespace of the games endpoint
     */
    gamesSocket: Namespace;

    /**
     * The map from id to game server
     */
    games: Map<string, GameServer>;

    /**
     * Whether maps generated should be randomized (false for increased testing performance)
     */
    randomizeTerrain: boolean;

    /**
     * The server that the next group of players will be added to
     */
    nextServerId: string;

    /**
     * Whether an admin has stated to force the game start
     */
    forceStart: boolean;

    /**
     * The map from a socket id to the player's info
     */
    idToInfo: Map<string, PlayerInfo>;

    /**
     * The map from a sockets id to the socket associated with it
     */
    idToSocket: Map<string, Socket>;

    constructor(serverSocket: Server, randomizeTerrain: boolean = false) {
        this.games = new Map<string, GameServer>();
        this.forceStart = false;
        this.randomizeTerrain = randomizeTerrain;

        this.idToInfo = new Map<string, PlayerInfo>();
        this.idToSocket = new Map<string, Socket>();

        this.serverSocket = serverSocket;
        // Create the socket for the games endpoint
        this.gamesSocket = serverSocket.of("/games");

        this.gamesSocket.on("connection", (socket: Socket) => {
            if (!socket.request.session) {
                socket.emit("/authorization", {message: "Authentication failed. You will now be disconnected."});
                socket.disconnect();
            } else {
                this.idToSocket.set(socket.id, socket);
                this.idToInfo.set(socket.id, new PlayerInfo(socket.id, socket.request.session.passport.user.nickname, socket.request.session.passport.user.role));

                socket.on("disconnect", () => {
                    this.idToSocket.delete(socket.id);
                    this.idToInfo.delete(socket.id);
                    // Tell all remaining sockets that this player has left
                    this.idToSocket.forEach((otherSocket: Socket, id: string) => otherSocket.emit("/update/remove/player", socket.id));
                });

                // Send the new player information about all of the current players
                this.idToInfo.forEach((player: PlayerInfo, id: string) => socket.emit("/update/new/player", player));
            }
        });

        console.log("Starting an initial server");
        this.startNewServer();

        // Check if there's anything to do once a second
        setInterval(() => {
            // Check if the game should start
            if (this.idToInfo.size > GameMatchmaking.numPlayerToStart || this.forceStart) {
                // If a new game server exists and it is ready then add the players to it
                if (this.nextServerId && this.games.get(this.nextServerId).curState == GameState.ready) {
                    console.log("Ready to start the game, informing players of the new server with id " + this.nextServerId);
                    this.idToSocket.forEach((socket: Socket, id: string) => socket.emit("/update/start", this.nextServerId));
                    // Tell the server how many players we are informing about the game so it knows how many to expect
                    this.games.get(this.nextServerId).startGame(this.idToSocket.size);
                    this.nextServerId = null;
                    this.forceStart = false;
                }
            }

            // Close games that are now over
            this.games.forEach((server: GameServer, id: string) => {
               if (server.curState == GameState.over) {
                   this.games.delete(id);

                   console.log("Previous game has finished, starting a new game");
                   this.startNewServer();
               }
            });
        }, 1000);
    }

    public startNewServer(): void {
        let newServer: GameServer = new GameServer(this.serverSocket, this.randomizeTerrain);
        this.nextServerId = newServer.serverId;
        this.games.set(this.nextServerId, newServer);
    }
}
