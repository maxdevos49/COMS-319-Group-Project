import { Namespace, Server, Socket } from "socket.io";
import { PlayerInfo } from "../public/javascript/game/models/PlayerInfo";
import v1Gen from "uuid/v1";
import { GameSimulation } from "./simulation/GameSimulation";
import { PlayerMoveUpdateQueue } from "../public/javascript/game/data-structures/PlayerMoveUpdateQueue";
import { PlayerMoveUpdate } from "../public/javascript/game/models/PlayerMoveUpdate";
import { IPositionUpdate } from "../public/javascript/game/models/objects/IPositionUpdate";
import { Player } from "./simulation/objects/Player";

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
    private clients: Map<string, Socket>;
	/**
	 * The map of every client id to their name
	 */
    private playerNames: Map<string, string>;
	/**
	 * The simulation of the physical game world.
	 */
    public simulation: GameSimulation;
	/**
	 * The queue like structure that move updates are buffered in
	 */
    private moveUpdateQueue: PlayerMoveUpdateQueue;

    constructor(serverSocket: Server) {
        this.clients = new Map<string, Socket>();
        this.playerNames = new Map<string, string>();

        this.serverId = v1Gen();
        this.moveUpdateQueue = new PlayerMoveUpdateQueue(100000, 10);
        this.simulation = new GameSimulation(this.moveUpdateQueue);

        // Initialize socket
        this.gameSocket = serverSocket.of("/games/" + this.serverId);

        this.gameSocket.on("connection", (socket: Socket) => {
            // console.log("A new client has connected to game: " + this.serverId);

            //Authentication
            if (!socket.request.session) {
                socket.disconnect();
            }

            let newClientId: string = v1Gen();
            // Send the new client their id
            socket.emit("/init/assignid", newClientId);

            //add nickname to names of players
            this.playerNames.set(newClientId, (socket.request.session) ? socket.request.session.passport.user.nickname : "");

            // Inform every other connected player that a new player has connected and inform new player of the existing players
            let newPlayerInfo = new PlayerInfo(newClientId, newClientId);
            this.clients.forEach((playerSocket: Socket, playerId: string) => {
                // Inform the old player of the new player
                playerSocket.emit("/update/player/new", newPlayerInfo);
                // Inform the new player of the old player
                socket.emit(
                    "/update/player/new",
                    new PlayerInfo(playerId, this.playerNames.get(playerId))
                );
            });

            // Add a record of the player
            this.clients.set(newClientId, socket);
            this.playerNames.set(newClientId, newClientId);

            // Send the new player descriptions of all of the objects as they are now
            socket.emit("/update/objects/new", this.simulation.getObjectDescriptions());

            // Add the player to the simulation
            this.simulation.addPlayer(newClientId);

            // Send the new player the terrain data
            socket.emit("/init/terrain", this.simulation.map);

            // Game player move update endpoint
            socket.on("/update/player/move", (newUpdate: PlayerMoveUpdate) => {
                this.moveUpdateQueue.addPlayerMoveUpdate(newUpdate);
            });
        });
        // 30 times a second
        setInterval(() => this.nextFrame(), GameSimulation.timeStep * 1000);
    }

	/**
	 * Performs one frame process, this causes the simulation to take one step (one frame) forward and then sends
	 * updates to the clients.
	 */
    private nextFrame(): void {
        // Process a physics frames
        this.simulation.nextFrame();
        // Pack up all of the new objects and send them (if there are any this frame)
        if (this.simulation.hasNewObjectDescriptions()) {
            this.gameSocket.emit("/update/objects/new", this.simulation.popNewObjectDescriptions());
        }
        // Pack up all of the deleted objects and send them (if there are any)
        if (this.simulation.hasDeletedObjects()) {
            this.gameSocket.emit("/update/objects/delete", this.simulation.popDeletedObjectIds());
        }

        // Pack up all of the PositionUpdates and send them to all clients
        let updates: IPositionUpdate[] = this.simulation.getPositionUpdates();
        this.clients.forEach((socket: Socket, id: string) => {
            // Get the player object of the given client, if one doesn't exist send all of the information to the server
            // Every certain number of frames send an update about everything in the game
            let player: Player = (this.simulation.objects.get(id) as Player);
            if (player && (this.simulation.frame % GameServer.FORCE_FULL_UPDATE_FRAME_RATE) != 0) {
                socket.volatile.emit("/update/position", updates.filter((update: IPositionUpdate) => {
                    return ((player.body.GetPosition().x - update.x) < (GameServer.PLAYER_VIEW_WIDTH / 2)) &&
                        ((player.body.GetPosition().y - update.y) < (GameServer.PLAYER_VIEW_HEIGHT / 2))
                }));
            } else {
                // If we cannot intelligently eliminate position updates as not needed then send all of them
                this.gameSocket.emit("/update/position", updates);
            }
        });
    }
}
