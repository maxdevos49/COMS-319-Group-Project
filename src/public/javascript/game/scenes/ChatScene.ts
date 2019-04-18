import { Chat } from "../gui/Chat.js";
import { ChatWindow } from "../gui/ChatWindow.js";

export class ChatScene extends Phaser.Scene {

    private chatWindow: ChatWindow;

    private test: number;

    constructor() {
        super({ key: "ChatScene" });
    }

    preload(): void {
    }

    create(): void {

        this.chatWindow = new ChatWindow(this, { x: 0, y: 0 });
        this.test = 0;

    }
    update(): void {

        this.test += 1;

        if (this.test % 30 === 0) {
            this.chatWindow.addChat(this.test);
        }
    }
}