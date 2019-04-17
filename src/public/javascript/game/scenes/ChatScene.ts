import { Chat } from "../objects/Chat";

export class ChatScene extends Phaser.Scene {

    private chat: Chat;

    constructor() {
        super({ key: "ChatScene" });
    }

    preload(): void {
        // this.load.atlas("sprites", "/res/spritesAtlas.png", "/res/spritesAtlas.json");
    }

    create(): void {
        // this.chat = new Chat(this, 10, 10, "HEllo", "");
    }

    update(): void {
    }
}