export class ChatInput extends Phaser.GameObjects.Container {

    public width: number;

    public height: number;

    public selected: boolean;

    //zones and shapes here

    constructor(givenScene: Phaser.Scene, config: IChatInputConfig) {
        super(givenScene);
    }

}

export interface IChatInputConfig {
    x: number;

    y: number;

    width: number;

    height: number;
}