import {GamesList} from "../models/games/GamesList.js";
import {PlayerInfo} from "../models/game/PlayerInfo.js";
import {PositionUpdateQueue} from "../data-structures/PositionUpdateQueue.js";
import {PositionUpdate} from "../models/game/objects/PositionUpdate.js";
import {PlayerMoveUpdate} from "../models/game/PlayerMoveUpdate.js";
import {ObjectDescription} from "../models/game/objects/ObjectDescription";
import {TerrainMap} from "../models/game/TerrainMap";

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
	 * Array of new objects that the server has sent
	 */
	public newObjects: ObjectDescription[];
	/**
	 * The terrain map from the server
	 */
	public map: TerrainMap;
	/**
	 * True if the connection has been made and all data that needs to be received before switching to the game scene has been loaded
	 */
	public ready: boolean;

	/**
	 * Creates a new game socket connection
	 */
	constructor() {
		this.roomId = "";
		this.clientId = "";
		this.socket = io("/games");

		this.positionUpdates = new PositionUpdateQueue();
		this.players = [];
		this.newObjects = [];
		this.ready = false;

		this.connectToGame();
	}

	/**
	 * Performs the connection handshake for the game
	 */
	private connectToGame(): void {
		this.socket.on("/list", (gamesList: GamesList) => {
			let index = Math.floor(Math.random() * gamesList.gameIds.length);
			this.roomId = gamesList.gameIds[index];
			//connect to new namespace
			this.socket = io("/games/" + this.roomId);
			this.connection();
		});

		//call for game id list
		this.socket.emit("/list");
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
			this.newObjectDescription();

			console.log("Connected to server!");
		});
	}

	/**
	 * Registers the client Id Socket Routes
	 */
	private receiveClientId(): void {
		this.socket.on("/init/assignid", (givenClientId: string) => {
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

	private newObjectDescription(): void {
		this.socket.on("/update/objects/new", (newObjects: ObjectDescription[]) => {
			console.log(`Received ${newObjects.length} new objects updates`);
			// Push all elements of the new array into the old one without allocating a new array
			newObjects.forEach((object: ObjectDescription) => this.newObjects.push(object));
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
	 * Send a move update to the server.
	 */
	public sendMove(move: PlayerMoveUpdate): void {
		this.socket.emit("/update/player/move", move);
	}
}
