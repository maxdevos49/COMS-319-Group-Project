let gameConfig: GameConfig = {
    title: "Example Game",
    version: "0.1",
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: "game",
    scene: [],
    physics: {
        default: "arcade",
        arcade: {
            gravity: {x: 0, y: 0}
        },
        debug: false
    },

    backgroundColor: "#ffffff"
};

export {gameConfig};