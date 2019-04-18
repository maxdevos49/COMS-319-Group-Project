import { Chat } from "./Chat.js";

export class ChatWindow extends Phaser.GameObjects.Container {

    /**
     * An array of all chat GameObjects
     */
    private chats: Chat[];

    /**
     * The font size to use for the chat
     */
    private fontSize: number;

    /**
    * The font type to use for the chat
    */
    private fontType: string;

    constructor(givenScene: Phaser.Scene, config: IChatWindowConfig) {
        super(givenScene, config.x, config.y);
        givenScene.add.existing(this);

        //Properties
        this.chats = [];
        this.fontSize = config.fontSize || 22;
    }

    /**
     *
     * @param givenText
     */
    addChat(givenText: any): void {

        //new Chat
        let newChat = new Chat(this.scene, { x: 0, y: this.scene.scale.height - this.fontSize * 2, text: givenText });

        //move any current chats
        this.chats.forEach((givenChat: Chat) => {
            givenChat.y -= this.fontSize;
        });

        //record it
        this.chats.push(newChat);
        this.add(newChat);

        //check if we can delete some now
        this.removeChat();
    }

    /**
     * Removes a chat GameObject
     */
    removeChat(): void {
        //remove the last if we have enough
        if (this.chats.length > this.scene.scale.height / this.fontSize - 1) {
            let givenChat = this.chats.splice(0, 1);
            givenChat[0].destroy();
        }
    }
}

/**
 * ChatWindow GameObject configuration interface
 */
export interface IChatWindowConfig {
    /**
     * Window position x
     */
    x: number;

    /**
     * Windows position y
     */
    y: number;

    /**
     * Font size of chat
     */
    fontSize?: number

    /**
     * Font of the chats in the Chat Window
     */
    font?: string;

    /**
     * Decay period for newly added chats in milliseconds
     */
    decay?: number;

}