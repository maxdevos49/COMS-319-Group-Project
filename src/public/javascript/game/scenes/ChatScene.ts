import { Chat } from "../objects/Chat.js";

export class ChatScene extends Phaser.Scene {

    private chats: Chat[];

    constructor() {
        super({ key: "ChatScene" });
    }

    preload(): void {
        // this.load.atlas("sprites", "/res/spritesAtlas.png", "/res/spritesAtlas.json");
    }

    create(): void {
        new Chat(this, 0, 0, "Madmax: Test Text 1");

    }

    update(): void {

    }
}