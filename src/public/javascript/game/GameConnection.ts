import { GamesList } from "./models/GamesList.js";
import { PlayerInfo } from "./models/PlayerInfo.js";
import { PositionUpdateQueue } from "./data-structures/PositionUpdateQueue.js";
import { IPositionUpdate } from "./models/objects/IPositionUpdate";
import { PlayerMoveUpdate } from "./models/PlayerMoveUpdate.js";
import { IEvent } from "./models/objects/IEvent.js";
import { TerrainMap } from "./models/TerrainMap";
import { IObjectDescription } from "./models/objects/Descriptions/IObjectDescription.js";

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
	 * Array of players that the server has sent
	 */
	public players: PlayerInfo[];
	/**
	 * Array of new objects that the server has sent waiting to be processed
	 */
	public newObjects: IObjectDescription[];
	/**
	 * Array of the deleted ids that the server has sent waiting to be processed
	 */
	public deletedObjects: string[];
	/**
	 * Events from the server that the player will handle.
	 */
	public events: IEvent[];
	/**
	 * The terrain map from the server which is a string containing JSON that should be in the shape of a TerrainMap
	 */
	public map: TerrainMap;
	/**
	 * True if the connection has been made and all data that needs to be received before switching to the game scene has been loaded
	 */
	public ready: boolean;

	/**
	 * Creates a new game socket connection
     * @param id The id of the game to connect to
	 */
	constructor(id: string) {
		this.roomId = "";
		this.clientId = "";

		this.positionUpdates = new PositionUpdateQueue();
		this.players = [];
		this.newObjects = [];
		this.deletedObjects = [];
		this.events = [];
		this.ready = false;

		this.roomId = id;
        this.socket = io("/games/" + id);

        this.connection();
	}

	/**
	 * Registers the socket routes to connect the client to the server
	 */
	private connection(): void {
		this.socket.on("connect", () => {
			//register any socket routes here
			this.receiveClientId();
			this.receiveTerrainMap();
			this.newPlayerInfo();
			this.positionUpdate();
			this.receiveEvent();
			this.newObjectDescription();
			this.updateDeletedObjects();

			console.log("Connected to server!");
		});
	}

	/**
	 * Registers the client Id Socket Routes
	 */
	private receiveClientId(): void {
		this.socket.on("/init/assignid", (givenClientId: string) => {
            console.log('received id: ' + givenClientId);
			this.clientId = givenClientId;
		});
	}

	private receiveTerrainMap(): void {
		this.socket.on("/init/terrain", (map: TerrainMap) => {
			this.map = map;
			this.ready = true;
		});
	}

	/**
	 * Registers the new player info socket routes
	 */
	private newPlayerInfo(): void {
		this.socket.on("/update/player/new", (otherPlayer: PlayerInfo) => {
			console.log(
				`Revieving Player updates.\n\tId: ${otherPlayer.id}\n\tName: ${
				otherPlayer.name
				}`
			);
			this.players.push(otherPlayer);
		});
	}

	/**
	 * Registers the new object description endpoint
	 */
	private newObjectDescription(): void {
		this.socket.on("/update/objects/new", (newObjects: IObjectDescription[]) => {
			// console.log(`Received ${newObjects.length} new objects updates`);
			// Push all elements of the new array into the old one without allocating a new array
			newObjects.forEach((object: IObjectDescription) => this.newObjects.push(object));
		});
	}

	/**
	 * Registers the deleted objects endpoint
	 */
	private updateDeletedObjects(): void {
		this.socket.on("/update/objects/delete", (deletedIds: string[]) => {
			// console.log(`Received ${deletedIds.length} deleted objects updates`);
			// Push all elements of the new array into the old one without allocating a new array
			deletedIds.forEach((id: string) => this.deletedObjects.push(id));
		});
	}

	/**
	 * Registers the client position update endpoint
	 */
	private positionUpdate(): void {
		this.socket.on("/update/position", (newUpdates: IPositionUpdate[]) => {
			newUpdates.forEach((update: IPositionUpdate) => {
				this.positionUpdates.addUpdate(update);
			});
		});
	}

	private receiveEvent(): void {
		this.socket.on("/update/event", (event: IEvent) => {
			this.events.push(event);
		});
	}

	/**
	 * Send a move update to the server.
	 */
	public sendMove(move: PlayerMoveUpdate): void {
		this.socket.emit("/update/player/move", move);
	}
}
