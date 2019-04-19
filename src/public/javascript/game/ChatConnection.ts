import { ChatWindow, IChatWindowConfig } from "./gui/ChatWindow.js";
import { IMessage } from "./models/objects/IMessage.js";

export class ChatConnection {

    /**
	 * Socket Connection Object
	 */
    private socket: SocketIOClient.Socket;

    /**
	 * The namespace id
	 */
    private connId: string;

    /**
     * The game scene
     */
    public scene: Phaser.Scene;

    /**
     * The chat window to display and recieve messages
     */
    private chatWindow: ChatWindow;

    /**
     * Client Id
     */
    private clientId: string;

    /**
     * Client Name
     */
    private clientName: string;

    /**
     * Constructs a Chat Connection
     * @param givenId
     * @param givenScene
     * @param givenConfig
     */
    constructor(givenId: string, givenScene: Phaser.Scene, givenConfig: IChatWindowConfig) {
        //properties
        this.connId = givenId;
        this.socket = io("/chat/" + this.connId, { reconnection: false });
        this.scene = givenScene;
        this.chatWindow = new ChatWindow(this.scene, givenConfig, this);

        //init routes
        this.authorize();
        this.recieveMessage();
        this.disconnect();
    }

    private disconnect(): void {
        this.socket.on("disconnect", () => {
            this.chatWindow.addChat({
                id: "id",
                name: "connection",
                message: "You have lost connection to the server.",
                color: 0xFF0000
            });
        });
    }

    private authorize(): void {
        this.socket.on("/authorization", (auth: any) => {
            this.clientId = auth.id;
            this.clientName = auth.name;
        })
    }

    /**
     * Handles recieving messages and adding them to the chat window
     */
    private recieveMessage(): void {
        this.socket.on("/newMessage", (givenMessage: IMessage) => {
            this.chatWindow.addChat(givenMessage);
        })
    }

    /**
     * Sends a chat message to the server
     */
    public sendMessage(givenMessage: string): void {
        let message: IMessage = {
            id: this.clientId,
            name: this.clientName,
            message: givenMessage
        }
        this.socket.emit("/sendMessage", message);
    }
}