import { Namespace, Server, Socket } from "socket.io";
import { PlayerInfo } from "../public/javascript/game/models/PlayerInfo";
import v1Gen from "uuid/v1";
import { GameSimulation } from "./simulation/GameSimulation";
import { PlayerMoveUpdateQueue } from "../public/javascript/game/data-structures/PlayerMoveUpdateQueue";
import { PlayerMoveUpdate } from "../public/javascript/game/models/PlayerMoveUpdate";
import { IPositionUpdate } from "../public/javascript/game/models/objects/IPositionUpdate";
import { IEvent } from "../public/javascript/game/models/objects/IEvent";
import { Player } from "./simulation/objects/Player";
import { ChatServer } from "./ChatServer";
import { GameObjectType } from "../public/javascript/game/models/objects/Descriptions/IObjectDescription";

export enum GameState {
    building,
    ready,
    waitingForPlayers,
    playing,
    over
}

export class GameServer {
	/**
	 * How many frames between sending out a full position update to all players
	 */
    public static FORCE_FULL_UPDATE_FRAME_RATE = 30;

	/**
	 * The width of the players view in meters (100 meters in a pixel)
	 * This will be centered on the player and determines which position updates to send to the player
	 */
    public static PLAYER_VIEW_WIDTH = 18;

	/**
	 * The height of the player view in meters (100 meters in a pixel)
	 * This will be centered on the player and determines which position updates to send to the player
	 */
    public static PLAYER_VIEW_HEIGHT = 13;

	/**
	 * The unique server id which identifies this server and is used in it's routes
	 */
    public serverId: string;

	/**
	 * The socket io room this game is listening to
	 */
    public gameSocket: Namespace;

	/**
	 * The clients that are connected to this server
	 */
    public clients: Map<string, Socket>;

	/**
	 * The map of every client id to their name
	 */
    private playerInfo: Map<string, PlayerInfo>;

	/**
	 * The simulation of the physical game world.
	 */
    public simulation: GameSimulation;

	/**
	 * The queue like structure that move updates are buffered in
	 */
    private moveUpdateQueue: PlayerMoveUpdateQueue;

    /**
     * The Chat server for the current Game
     */
    private chatServer: ChatServer;

    /**
     * The current state of the server is it's lifecycle
     */
    public curState: GameState;

    /**
     * The number of players to expect to join
     */
    public numPlayersToExpect: number;

    /**
     * Constructs a GameServer object
     * @param serverSocket
     */
    constructor(serverSocket: Server, randomizeTerrain: boolean = false) {
        this.curState = GameState.building;

        this.clients = new Map<string, Socket>();
        this.playerInfo = new Map<string, PlayerInfo>();

        this.serverId = v1Gen();
        this.moveUpdateQueue = new PlayerMoveUpdateQueue(100000, 10);
        this.simulation = new GameSimulation(this.moveUpdateQueue, randomizeTerrain);

        // Initialize socket
        this.gameSocket = serverSocket.of("/games/" + this.serverId);

        //init chat
        this.chatServer = new ChatServer(this.serverId, serverSocket);


        this.gameSocket.on("connection", (socket: Socket) => {
            // console.log("A new client has connected to game: " + this.serverId);

            //Authentication
            if (!socket.request.session) {
                console.log("Rejecting connection");
                socket.emit("/authorization", { message: "Authentication failed. You will now be disconnected." });
                socket.disconnect();
            } else if (this.curState == GameState.playing) {
                socket.emit("/authorization", { message: "You cannot join a game that has already started" });
                socket.disconnect();
            } else {

                let newClientId: string = v1Gen();
                // Send the new client their id
                socket.emit("/init/assignid", newClientId);

                //add nickname to names of players
                this.playerInfo.set(newClientId, new PlayerInfo(newClientId, socket.request.session.passport.user.nickname, socket.request.session.passport.user.role));

                this.clients.forEach((playerSocket: Socket, playerId: string) => {
                    // Inform the old player of the new player
                    playerSocket.emit("/update/player/new", this.playerInfo.get(newClientId));
                    // Inform the new player of the old player
                    socket.emit(
                        "/update/player/new",
                        this.playerInfo.get(playerId)
                    );
                });

                // Add a record of the player
                this.clients.set(newClientId, socket);

                // Send the new player descriptions of all of the objects as they are now
                socket.emit("/update/objects/new", this.simulation.getObjectDescriptions());

                // Send the new player the terrain data
                socket.emit("/init/terrain", this.simulation.map);

                // Register the endpoint that listens for move updates from the client
                this.setOnUpdateMove(socket);

                // Register the endpoint for when a client disconnects.
                // Passing in the client ID here saves us from having to
                // iterate over the client map to get the ID for a given socket.
                this.setOnDisconnect(socket, newClientId);
            }
        });
        // 30 times a second
        setInterval(() => this.nextFrame(), GameSimulation.timeStep * 1000);

        this.curState = GameState.ready;
    }

    /**
     * Begins the game start sequence, the game server will wait until the given number of players connects or until
     * the timeout finishes
     * @param numberPlayers The number of players to expect to connect
     */
    public startGame(numberPlayers: number) {
        this.curState = GameState.waitingForPlayers;
        this.numPlayersToExpect = numberPlayers;
    }

	/**
	 * Performs one frame process, this causes the simulation to take one step (one frame) forward and then sends
	 * updates to the clients.
	 */
    private nextFrame(): void {

        // The following tasks are performed regardless of whether the game has started
        // Pack up all of the new objects and send them (if there are any this frame)
        if (this.simulation.hasNewObjectDescriptions()) {
            this.gameSocket.emit("/update/objects/new", this.simulation.popNewObjectDescriptions());
        }
        // Pack up all of the deleted objects and send them (if there are any)
        if (this.simulation.hasDeletedObjects()) {
            this.gameSocket.emit("/update/objects/delete", this.simulation.popDeletedObjectIds());
        }
        if (this.simulation.hasPendingEvents()) {
            this.simulation.events.forEach((event: IEvent) => {
                const socket: Socket = this.clients.get(event.forPlayerId);
                if (socket != null) {
                    socket.emit("/update/event", event);
                }
            });
            this.simulation.events = [];
        }

        // The following tasks are performed only if the simulation has started
        if (this.curState == GameState.playing) {
            // Process a physics frames
            this.simulation.nextFrame();
            // Pack up all of the PositionUpdates and send them to all clients
            let updates: IPositionUpdate[] = this.simulation.getPositionUpdates();
            this.clients.forEach((socket: Socket, id: string) => {
                // Get the player object of the given client, if one doesn't exist send all of the information to the server
                // Every certain number of frames send an update about everything in the game
                let player: Player = (this.simulation.objects.get(id) as Player);

                if (player && (this.simulation.frame % GameServer.FORCE_FULL_UPDATE_FRAME_RATE) != 0) {
                    socket.volatile.emit("/update/position", updates.filter((update: IPositionUpdate) => {
                        // If the position update doesn't provide xy coordinate always send it
                        if (update.x === undefined || update.y === undefined) {
                            return true;
                        }

                        return ((player.body.GetPosition().x - update.x) < (GameServer.PLAYER_VIEW_WIDTH / 2)) &&
                            ((player.body.GetPosition().y - update.y) < (GameServer.PLAYER_VIEW_HEIGHT / 2))
                    }));
                } else {
                    // If we cannot intelligently eliminate position updates as not needed then send all of them
                    this.gameSocket.emit("/update/position", updates);
                }
            });

            // Check if only one player remains and end the game if so
            if (this.simulation.getAllObjectsOfType(GameObjectType.Player).length <= 1) {
                console.log("Only one player remains, game is over");
                this.curState = GameState.over;
            }

        } else {
            // Check if the game is ready to start
            if (this.curState == GameState.waitingForPlayers &&  this.clients.size == this.numPlayersToExpect) {
                this.curState = GameState.playing;
                // Place the players around the map
                this.simulation.setPlayers(Array.from(this.clients.keys()));
            }
        }
    }

    /**
     * Set a listener on the given socket to handle player move updates.
     * @param socket The socket to set a listener on.
     */
    private setOnUpdateMove(socket: Socket): void {
        socket.on("/update/player/move", (newUpdate: PlayerMoveUpdate) => {
            this.moveUpdateQueue.addPlayerMoveUpdate(newUpdate);
        });
    }

    /**
     * Set a listener on the given socket to handle a disconnection.
     * @param socket The socket to set a listener on.
     * @param id The ID associated with the socket.
     */
    private setOnDisconnect(socket: Socket, id: string): void {
        socket.on("disconnect", () => {
            this.simulation.destroyGameObject(id);
        });
    }
}
