import { Chat, IChatConfig } from "./Chat.js";
import { ChatInput, IChatInputConfig } from "./ChatInput.js";

export class ChatWindow extends Phaser.GameObjects.Container {

    /**
     * An array of all chat GameObjects
     */
    private chats: Chat[];

    /**
     * Chat input
     */
    private ChatInput: ChatInput;

    /**
     * The font size to use for the chat
     */
    public fontSize: number;

    /**
    * The font type to use for the chat
    */
    public fontType: string;

    /**
     * The time it takes for each chat to decay
     */
    public decay: number;

    /**
     * The Character width before the chat wraps
     */
    public charWidth: number;

    constructor(givenScene: Phaser.Scene, config: IChatWindowConfig) {
        super(givenScene, config.x, config.y);

        //Properties
        this.chats = [];
        this.fontSize = config.fontSize;
        this.fontType = config.fontType;
        this.width = config.width;
        this.height = config.height;
        this.decay = config.decay;
        this.charWidth = config.charWidth;

        //GameObjects
        this.ChatInput = new ChatInput(this.scene, {
            x: this.x,
            y: this.height - this.fontSize - 2,
            width: this.width,
            height: this.fontSize + 4,
            fontType: this.fontType,
            fontSize: this.fontSize
        });

        //Add to scene
        this.add([this.ChatInput]);
        givenScene.add.existing(this);

    }

    /**
     *
     * @param givenText
     */
    addChat(givenText: any): void {

        //new Chat
        let newChat = new Chat(this.scene, {
            x: this.x,
            y: this.height - this.fontSize * 2,
            width: this.width,
            height: this.fontSize + 4,
            fontType: this.fontType,
            fontSize: this.fontSize,
            decay: this.decay,
            charWidth: this.charWidth,
            text: givenText
        });

        newChat.y = this.height - newChat.getHeight() - this.fontSize - 2;

        //move any current chats
        this.chats.forEach((givenChat: Chat) => {
            givenChat.y -= givenChat.getHeight();
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
        if (this.chats.length > this.height / this.fontSize - 1) {
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
     * The width of the Chat Window
     */
    width: number;

    /**
     * The height of the Chat Window
     */
    height: number;

    /**
     * Font size of chat
     */
    fontSize: number

    /**
     * Font of the chats in the Chat Window
     */
    fontType: string;

    /**
     * Decay period for newly added chats in milliseconds
     */
    decay: number;

    /**
     * Maximum character width for the chat before it wraps
     */
    charWidth: number;

}