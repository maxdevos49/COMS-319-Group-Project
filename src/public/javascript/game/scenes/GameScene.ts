import {Player} from "../objects/Player.js";
import {GameConnection} from "../GameConnection.js";
import {GameObject} from "../objects/GameObject.js";
import {PositionUpdate} from "../../models/game/objects/PositionUpdate.js";
import {UserInput} from "../objects/UserInput.js";
import {NewObjectType, ObjectDescription} from "../../models/game/objects/ObjectDescription.js";
import {PlayerObjectDescription} from "../../models/game/objects/PlayerObjectDescription.js";


export class GameScene extends Phaser.Scene {
    /**
     * The connection to the server
     */
    connection: GameConnection;
    /**
     * The data from id to game object that contains all game objects in the game
     */
    private objects: Map<string, GameObject>;
	/**
     * The tile map for this game server
	 */
	private tileMap: Phaser.Tilemaps.Tilemap;
	/**
     * The ground layer of the map
	 */
	private groundLayer: Phaser.Tilemaps.StaticTilemapLayer;
    /**
     * A reference to the player that this client is playing
     */
    private clientPlayer: Player;
    /**
     * The user input object that will move the player.
     */
    private uInput: UserInput;

    constructor() {
        super({
            key: "GameScene"
        });

        this.objects = new Map<string, GameObject>();
    }

    init(connection: GameConnection): void {
        this.connection = connection;
		this.uInput = new UserInput(this);
    }

    preload(): void {
        this.tileMap = this.add.tilemap(
        	this.connection.roomId,
			this.connection.map.tileWidth,
			this.connection.map.tileHeight,
			this.connection.map.width,
			this.connection.map.height,
			this.connection.map.data
		);
        let tiles = this.tileMap.addTilesetImage("tiles");
        this.groundLayer = this.tileMap.createStaticLayer(0, tiles, 0, 0);
    }

    update(): void {
        // Check for new game objects
        this.connection.newObjects.forEach((object: ObjectDescription) => this.addNewObject(object));
        this.connection.newObjects = [];

        // Apply updates
        this.objects.forEach((object: GameObject, id: string) => {
            // Apply updates from server
            let tempUpdate: PositionUpdate = this.connection.positionUpdates.popUpdate(id);
            if (tempUpdate != null) {
                object.applyUpdate(tempUpdate);
            }
        });

		// Send the players move to the server
        // Wait until the clients own player has been loaded to start sending updates
        if (this.clientPlayer) {
			let moveUpdate = this.uInput.getMoveUpdateFromInput(this.connection.clientId, this.clientPlayer);
			this.connection.sendMove(moveUpdate);
		}
    }

    private addNewObject(newObjectDescription: ObjectDescription) {
        let object: GameObject;
        if (newObjectDescription.type === NewObjectType.Player) {
			object = new Player(this, newObjectDescription as PlayerObjectDescription);
			// Check if the id of this object is the clients, if it is save the reference to it
            if (this.connection.clientId === newObjectDescription.id) this.clientPlayer = object as Player;
        } else {
            throw "Unknown game object type";
        }
        this.objects.set(object.id, object);
        this.add.existing(object);
    }

}