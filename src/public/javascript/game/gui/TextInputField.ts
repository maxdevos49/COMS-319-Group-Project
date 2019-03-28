const TEXT_INPUT_FIELD_ALLOWED_CHARACTERS: string = "abcdefghijklmnopqrstuvwxyz";

export class TextInputField extends Phaser.GameObjects.Zone {
    /**
     * Whether this text field is currently selected. If true character inputs will be captured by the input field
     */
    selected: boolean;
    /**
     * The text that the user has entered
     */
    text: string;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y, width, height);
        scene.add.rectangle(x, y, width, height, 0x0000FF);

        this.selected = false;
        this.text = "";

        // Add mouse listener that tracks whether the field is selected
        scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]) => {
            // Pointer was clicked outside of the zone
            if (!this.getBounds().contains(pointer.x, pointer.y)) {
                console.log("Unselected");
                this.selected = false;
            } else {
                console.log("Selected");
                this.selected = true;
            }
        });
        // Add the allowed characters
        TEXT_INPUT_FIELD_ALLOWED_CHARACTERS.split('').forEach((allowedKey: string) => {
           scene.input.keyboard.addKey(allowedKey).setEmitOnRepeat(true).on('down', (key: Phaser.Input.Keyboard.Key) => {
               if (this.selected) {
                   this.text += allowedKey;
                   console.log(this.text);
               }
           });
        });
        // Add the space character
        scene.input.keyboard.addKey('space').setEmitOnRepeat(true).on('down', (key: Phaser.Input.Keyboard.Key) => {
           if (this.selected) {
               this.text += ' ';
               console.log(this.text);
           }
        });
        // Add the backspace character
        scene.input.keyboard.addKey('backspace').setEmitOnRepeat(true).on('down', (key: Phaser.Input.Keyboard.Key) => {
           if (this.selected) {
               this.text = this.text.slice(0, -1);
               console.log(this.text);
           }
        });
    }
}