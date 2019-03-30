import { GamesList } from "../models/games/GamesList.js";
import { PlayerUpdate } from "../models/games/PlayerUpdate.js";

/**
 *
 */
export class GameConnection {
    /**
     * Socket Connection Object
     */
    private socket: SocketIOClient.Socket;

    /**
     * The namespace id
     */
    public roomId: string;

    /**
     * The Client Id
     */
    public clientId: string;

    /**
     * Creates a new game socket connection
     */
    constructor() {
        this.roomId = "";
        this.clientId = "";
        this.socket = io("/games");

        this.handshake();
    }

    /**
     * Registers the socket routes to connect the client to the server
     */
    private connection(): void {
        this.socket.on("connect", () => {
            console.log("Connected to server!");
            
            //register any socket routes here
            this.receiveClientId();
            this.beginGame();
            this.playerUpdate();


        });
    }

    /**
     * Registers the begin game socket routes
     */
    private beginGame(): void {
        this.socket.on("/update/begingame", () => {
            console.log("Game has begun!");
        });
    }

    /**
     * Registers the Player Update socket routes
     */
    private playerUpdate(): void {
        this.socket.on("/update/playerupdate", (otherPlayer: PlayerUpdate) => {
            console.log(
                `Revieving Player updates.\n\tId: ${otherPlayer.id}\n\tName: ${
                    otherPlayer.name
                }`
            );
        });
    }

    /**
     * Registers the client Id Socket Routes
     */
    private receiveClientId(): void {
        this.socket.on("/update/assignid", (givenClientId: string) => {
            this.clientId = givenClientId;
        });
    }

    /**
     * Performs the connection handshake for the game
     */
    private handshake(): void {
        this.socket.on("/list", (gamesList: GamesList) => {
            let index = Math.floor(Math.random() * gamesList.gameIds.length);
            this.roomId = gamesList.gameIds[index];
            //connect to new namespace which actually wipes out old socket because namespaces are not like rooms
            this.socket = io("/games/" + this.roomId);
            this.connection();
        });

        //call for game id list
        this.socket.emit("/list");
    }

    /**
     * Tells the server the nickname the client has chosen
     */
    public addNickName(givenNickName: string): void {
        this.socket.emit("/update/assignname", givenNickName);
    }
}
