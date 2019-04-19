import { ChatConnection } from "../ChatConnection.js";
import { IChatWindowConfig } from "../gui/ChatWindow.js";

export class ChatScene extends Phaser.Scene {

    private chatConnection: ChatConnection;

    constructor() {
        super({ key: "ChatScene" });
    }

    init(givenId: any): void {

        let config: IChatWindowConfig = {
            x: 0,
            y: 0,
            width: this.scale.width * (3 / 4),
            height: this.scale.height,
            fontSize: 20,
            fontType: "november",
            charWidth: 90,
            chatHeight: 10,
            decay: 5000
        }

        this.chatConnection = new ChatConnection(givenId.roomId, this, config);
    }

}