export class ControlsScene extends Phaser.Scene {

    public text: Phaser.GameObjects.BitmapText[];

    constructor() {
        super({ key: "ControlsScene" });
        this.text = [];
    }

    public create(): void {
        let height = this.cameras.main.height;
        let width = this.cameras.main.width;

        let controls: any = [
            {
                title: "Movement:",
                control: [
                    "UP: W",
                    "LEFT: A",
                    "DOWN: S",
                    "RIGHT: D",
                    "Also Cursor Keys."
                ]
            },
            {
                title: "Combat:",
                control: [
                    "Click to shoot",
                    "Move mouse to aim",
                ]
            }
        ];

        for (let i = 0; i < controls.length; i++) {

            let offsetx = (width / 2 - controls.length * 400 / 2) + (i * 400);
            let offsety = height / 3;

            this.text.push(new Phaser.GameObjects.BitmapText(this, offsetx, offsety, "november", controls[i].title, 60));
            this.text[this.text.length - 1].setTint(0xffffff);
            this.add.existing(this.text[this.text.length - 1]);

            offsety += 64;
            offsetx += 20;

            for (let j = 0; j < controls[i].control.length; j++) {
                console.log(controls[i].control[j], i, j);
                this.text.push(new Phaser.GameObjects.BitmapText(this, offsetx, offsety, "november", controls[i].control[j], 40));
                this.text[this.text.length - 1].setTint(0xffffff);
                this.add.existing(this.text[this.text.length - 1]);

                offsety += 44;

            }

            offsetx -= 20;
        }


        this.text.push(new Phaser.GameObjects.BitmapText(this, width / 2, height / 5, "november", "Objective: Outlive everyone else and stay out of the storm", 40))
        this.text[this.text.length - 1].setTint(0xffffff);
        this.add.existing(this.text[this.text.length - 1]);
        this.text[this.text.length - 1].setOrigin(0.5, 0.5);

        this.text.push(new Phaser.GameObjects.BitmapText(this, width / 2, height - height/5, "november", "Press any key to return to main menu", 30))
        this.text[this.text.length - 1].setTint(0xffffff);
        this.add.existing(this.text[this.text.length - 1]);
        this.text[this.text.length - 1].setOrigin(0.5, 0.5);

        this.input.keyboard.on("keydown", () => {
            this.scene.start("MainMenuScene");
        })
    }
}