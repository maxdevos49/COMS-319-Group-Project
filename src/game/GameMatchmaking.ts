import {Namespace, Server, Socket} from "socket.io";
import { GameServer } from "./GameServer";
import { GamesList } from "../public/javascript/game/models/GamesList";

export class GameMatchmaking {
    /**
     * The root server socket of this server
     */
    serverSocket: Server;
    /**
     * The socket namespace of the games endpoint
     */
    gamesSocket: Namespace;

    /**
     * The list of active games in the server
     */
    games: GameServer[];

    constructor(serverSocket: Server, randomizeTerrain: boolean = false) {
        this.games = [];
        this.serverSocket = serverSocket;
        // Create the socket for the games endpoint
        this.gamesSocket = serverSocket.of("/games");
        this.gamesSocket.on("connection", (socket: Socket) => {
            // Messages for debugging
            console.log("A client has connected to the games namespace");
            socket.on("disconnect", () => {
                console.log("A client has disconnected to the games namespace");
            });
            // Client request list of existing games
            socket.on("/list", () => {
                let listToSend: GamesList = new GamesList();
                // Loop through every game server and add it's id to the list
                this.games.forEach((game: GameServer) => {
                    listToSend.gameIds.push(game.serverId);
                });
                // Send the list of games to the socket that requested it
                socket.emit("/list", listToSend);
            });
        });

        // TODO: Implement smart game begin/end
        this.games.push(new GameServer(serverSocket, randomizeTerrain));
        console.log(
            "A game server has begun with id: " + this.games[0].serverId
        );
    }
}
