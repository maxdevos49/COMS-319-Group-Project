export class Player extends Phaser.GameObjects.Sprite {
    /**
     * Registers the animations used by player objects
     * @param animationManager The animation manager to register the animations into
     */
    public static createAnimations(animationManager: Phaser.Animations.AnimationManager) {
        animationManager.create({
            key: "objects/player/walking",
            frames: [
                {key: 'objects/player/walking/1', frame: 0},
                {key: 'objects/player/walking/2', frame: 1}
            ],
            frameRate: 30,
            repeat: -1
        });
    }
    /**
     * The id of this player
     */
    public id: string;

    /**
     * Creates a new player in the given scene
     * @param scene The scene that the player should be created in
     * @param x The x coordinate the player should be created at
     * @param y The y coordinate the player should be created at
     * @param id The id of the player to be created
     */
    constructor(scene: Phaser.Scene, x: number, y: number, id: string) {
        super(scene, x, y, "player");
        this.id =id;
    }
}