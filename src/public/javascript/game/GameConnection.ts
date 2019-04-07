import { GamesList } from "../models/games/GamesList.js";
import { PlayerInfo } from "../models/game/PlayerInfo.js";
import {PositionUpdateQueue} from "../data-structures/PositionUpdateQueue.js";
import {PositionUpdate} from "../models/game/objects/PositionUpdate.js";
import { PlayerMoveUpdate } from "../models/game/PlayerMoveUpdate.js";

/**
 * Socket endpoints for the client.
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
     * The queue which new position updates are added to when received by there server
     */
    public positionUpdates: PositionUpdateQueue;
    /**
     * Array of new players that the server has sent
     */
    public newPlayersIds: PlayerInfo[];
    /**
     * Creates a new game socket connection
     */
    constructor() {
        this.roomId = "";
        this.clientId = "";
        this.socket = io("/games");

        this.positionUpdates = new PositionUpdateQueue();
        this.newPlayersIds = [];

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
            this.positionUpdate();

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
        this.socket.on("/update/playerupdate", (otherPlayer: PlayerInfo) => {
            console.log(
                `Revieving Player updates.\n\tId: ${otherPlayer.id}\n\tName: ${
                    otherPlayer.name
                }`
            );
            this.newPlayersIds.push(otherPlayer);
        });
    }

    /**
     * Registers the client position update endpoint
     */
    private positionUpdate(): void {
        this.socket.on("/update/position", (newUpdates: PositionUpdate[]) => {
            newUpdates.forEach((update: PositionUpdate) => {
                this.positionUpdates.addUpdate(update);
            });
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

    /**
     * Send a move update to the server.
     */
    public sendMove(move: PlayerMoveUpdate): void {
        this.socket.emit("/update/playermove", move);
    }
}
