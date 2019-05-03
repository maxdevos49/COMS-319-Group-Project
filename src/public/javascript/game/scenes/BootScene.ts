export class BootScene extends Phaser.Scene {
    constructor() {
        super({
            key: "BootScene"
        });
    }

    preload(): void {
        let height = this.cameras.main.height;
        let width = this.cameras.main.width;

        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();

        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width/2 - 320/2, height/2 - 25, 320, 50);

        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        let percentText = this.make.text({
            x: width / 2,
            y: height / 2,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        let assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });

        assetText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value: any) {
            percentText.setText((parseInt(value) * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width/2 - 300/2, height/2 - 15, 300 * value, 30);
        });

        this.load.on('fileprogress', function (file: any) {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', () => {
            setTimeout(() => {
                progressBar.destroy();
                progressBox.destroy();
                loadingText.destroy();
                percentText.destroy();
                assetText.destroy();
                this.scene.start("MainMenuScene");
            }, 1500)
        });

        this.load.scenePlugin('AnimatedTiles', '/lib/phaser/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
        this.load.bitmapFont('november', '/res/November.png', '/res/November.fnt');
        this.load.atlas("sprites", "/res/spritesAtlas.png", "/res/spritesAtlas.json");
        this.load.image("tiles", "/res/tiles.png");
    }
}