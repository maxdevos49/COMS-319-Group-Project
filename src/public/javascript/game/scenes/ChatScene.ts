import { Chat } from "../gui/Chat.js";
import { ChatWindow, IChatWindowConfig } from "../gui/ChatWindow.js";

export class ChatScene extends Phaser.Scene {

    private chatWindow: ChatWindow;

    private test: number;

    constructor() {
        super({ key: "ChatScene" });
    }

    preload(): void {
    }

    create(): void {

        let config: IChatWindowConfig = {
            x: 0,
            y: 0,
            width: this.scale.width * (3 / 4),
            height: this.scale.height,
            fontSize: 20,
            fontType: "november",
            charWidth: 90,
            decay: 5000
        }

        this.chatWindow = new ChatWindow(this, config);
        this.test = 0;

    }
    update(): void {

        this.test += 1;

        if (this.test % 30 === 0) {
            this.chatWindow.addChat("[Madmax] This is a test. #" + this.test);
        }
    }
}