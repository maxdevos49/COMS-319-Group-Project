import { Player } from "../objects/Player.js";
import { GameConnection } from "../GameConnection.js";
import { GameObject } from "../objects/GameObject.js";
import { UserInput } from "../objects/UserInput.js";
import { Bullet } from "../objects/Bullet.js";
import { IObjectDescription, GameObjectType } from "../models/objects/IObjectDescription.js";
import { IPositionUpdate } from "../models/objects/IPositionUpdate.js";
import { PlayerObjectDescription } from "../models/objects/PlayerObjectDescription.js";
import { BulletObjectDescription } from "../models/objects/BulletObjectDescription.js";


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
     * The the tile map for the game
     */
	private tileMap: Phaser.Tilemaps.Tilemap;
    /**
     * A reference to the player that this client is playing
     */
	private clientPlayer: Player;
    /**
     * The user input object that will move the player.
     */
    private uInput: UserInput;
	/**
	 * The last frame processed and rendered by this game scene
	 */
	private lastFrame: number;
    /**
     * The point that the camera will follow. The camera cannot directly follow the player because of subpixel movement
     */
    private cameraFollowPoint: Phaser.Geom.Point;

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
			null,
			this.connection.map.tileWidth,
			this.connection.map.tileHeight,
			this.connection.map.width,
			this.connection.map.height,
			this.connection.map.data
		);
        let tiles = this.tileMap.addTilesetImage("tiles");
        this.tileMap.createStaticLayer(0, tiles, 0, 0);
        this.lastFrame = 0;

        this.cameraFollowPoint = new Phaser.Geom.Point(-1000, -1000);
        this.cameras.main.startFollow(this.cameraFollowPoint);
    }

    update(timestep: number, elapsed: number): void {
    	// Limit updates to be processed once every 30 seconds
    	let curFrame = Math.floor(timestep / 30);
    	if (this.lastFrame == curFrame) {
    		return;
		} else {
    		this.lastFrame = curFrame;
		}
        // Check for new game objects
        this.connection.newObjects.forEach((object: IObjectDescription) => this.addNewObject(object));
        this.connection.newObjects = [];
        // Check for deleted objects
		this.connection.deletedObjects.forEach((id: string) => this.removeObject(id));
		this.connection.deletedObjects = [];

		// Apply updates
		this.objects.forEach((object: GameObject, id: string) => {
			// Apply updates from server
			let tempUpdate: IPositionUpdate = this.connection.positionUpdates.popUpdate(id);
			if (tempUpdate != null) {
				object.applyUpdate(tempUpdate);
			}
		});

		// Send the players move to the server
		// Wait until the clients own player has been loaded to start sending updates
		if (this.clientPlayer) {
			let moveUpdate = this.uInput.getMoveUpdateFromInput(this.connection.clientId, this.clientPlayer);
			this.connection.sendMove(moveUpdate);

			// Move the camera
            this.cameraFollowPoint.x = Math.floor(this.clientPlayer.x);
            this.cameraFollowPoint.y = Math.floor(this.clientPlayer.y);

            console.log(this.clientPlayer.x / 32 + " " + this.clientPlayer.y / 32);
		}
	}

    private addNewObject(newObjectDescription: IObjectDescription) {
        let object: GameObject;
        if (newObjectDescription.type === GameObjectType.Player) {
			object = new Player(this, newObjectDescription as PlayerObjectDescription);
			// Check if the id of this object is the clients, if it is save the reference to it
			if (this.connection.clientId === newObjectDescription.id) {
				this.clientPlayer = object as Player;
			}
        } else if (newObjectDescription.type === GameObjectType.Bullet) {
			object = new Bullet(this, newObjectDescription as BulletObjectDescription);
		} else {
            throw "Unknown game object type";
        }
        this.objects.set(object.id, object);
        this.add.existing(object);
    }

	/**
	 * Removes the object with the given id from the game scene
	 * @param id The id of the object to remove
	 */
	private removeObject(id: string) {
    	if (this.objects.has(id)) {
    		let object: GameObject = this.objects.get(id);
    		object.destroy();
    		this.objects.delete(id);
		}
	}

}