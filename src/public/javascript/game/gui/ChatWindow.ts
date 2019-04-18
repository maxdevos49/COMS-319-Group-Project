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
    private chatInput: ChatInput;

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

    /**
     * The height in chats that they can pile up too
     */
    private chatHeight: number;

    /**
     * Determins if the chat window is focused or not
     */
    private isActive: boolean;

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
        this.chatHeight = config.chatHeight;
        this.isActive = false;

        //GameObjects
        this.chatInput = new ChatInput(this.scene, {
            x: this.x,
            y: this.height - this.fontSize - 2,
            width: this.width,
            height: this.fontSize + 4,
            fontType: this.fontType,
            fontSize: this.fontSize
        });

        //Add to scene
        this.add([this.chatInput]);
        givenScene.add.existing(this);

        //add event listeners
        this.addEventListeners();
    }

    private addEventListeners(): void {

        this.scene.input.keyboard.on('keydown', (event: KeyboardEvent) => {
            event.preventDefault();

            if (this.isActive) {
                if ("Enter" === event.key) {
                    this.sendChat();
                } else if ("Escape" === event.key) {
                    this.toInactive();
                }
            } else {
                if (event.keyCode === 84) {
                    this.toActive();
                }
            }

        });

        this.scene.input.keyboard.on('keyup', (event: KeyboardEvent) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            // event.stopPropagation()

            if (!this.isActive) {
                if (event.keyCode === 84) {
                    this.toActive();
                }
            }
        });
    }

    public sendChat(): void {

        //TODO socket stuff
        
        this.addChat(this.chatInput.text.text);
        this.chatInput.text.setText("");
        this.toInactive();
    }

    public toInactive(): void {
        this.isActive = false;
        this.chatInput.toInactive();

        for (let i = 0; i < this.chats.length; i++) {
            if (i <= this.chats.length - this.chatHeight) {
                this.chats[i].setVisible(false)
            } else {
                this.chats[i].hide();
            }

        }
    }

    public toActive(): void {
        this.isActive = true;
        this.chatInput.toActive();

        this.chats.forEach((givenChat: Chat) => {
            givenChat.show();
        })
    }

    /**
     *
     * @param givenText
     */
    addChat(givenText: string): void {
        if (givenText.length > 0) {
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
            this.enforceHeight();
        }
    }

    /**
     * Enforces the chat height
     */
    private enforceHeight(): void {
        if (!this.isActive) {
            if (this.chats.length >= this.chatHeight) {
                this.chats[this.chats.length - this.chatHeight].setVisible(false);
            }
        }
    }

    /**
     * Removes a chat GameObject
     */
    private removeChat(): void {
        //remove the last if we have enough
        if (this.chats.length > this.height / this.fontSize - 2) {
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

    /**
     * The height in chats that can pile up on the screen
     */
    chatHeight: number;

}