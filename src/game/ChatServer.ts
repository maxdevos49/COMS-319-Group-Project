import { Socket, Server, Namespace } from "socket.io";
import { ICommand } from "./interfaces/ICommand";
import v1 from "uuid/v1";
import { IMessage } from "../public/javascript/game/models/objects/IMessage";

export class ChatServer {

    /**
     * The chat server id for identification
     */
    public id: string;

    /**
     * The Socket.io chat namespace
     */
    private ioServer: Namespace;

    /**
     * A map of all the connected clients
     */
    private connectedSockets: Map<string, Socket>;

    /**
     * A map of all connected names of clients
     */
    private playerNames: Map<string, string>;

    /**
     *  A map of all special commands recieved
     */
    public commandsRecieved: ICommand[];

    /**
     * Determins if Commands are enabled or added to the stack. Default is false.
     */
    public commandsEnabled: boolean;

    /**
     * Constructs a chat server
     * @param givenId
     */
    constructor(givenId: string, givenServer: Server) {
        //properties
        this.id = givenId;
        this.commandsRecieved = [];
        this.commandsEnabled = false;
        this.connectedSockets = new Map<string, Socket>();
        this.playerNames = new Map<string, string>();
        this.ioServer = givenServer.of("/chat/" + this.id);

        //init routes
        this.connectionSocket();
    }

    /**
     * Sends a message to all connected chat sockets or excluding an option single socket
     */
    public sendToMany(givenMessage: IMessage, givenExclusionId?: string): void {
        if (!givenExclusionId) {
            //send to all sockets
            this.ioServer.emit("/newMessage", givenMessage);
        } else {
            //sends to all but a single socket
            this.connectedSockets.forEach((givenSocket: Socket, givenId: string) => {
                if (givenId != givenExclusionId) {
                    givenSocket.emit("/newMessage", givenMessage);
                }
            })
        }
    }

    /**
    * Sends a message to a specific connected chat socket
    */
    public sendToOne(givenMessage: IMessage): void {
        //send to a single socket
        if (this.connectedSockets.has(givenMessage.reciever)) {
            this.connectedSockets.get(givenMessage.reciever).emit("/newMessage", givenMessage);
        }
    }

    /**
     * Handles the connection to all chat sockets
     */
    private connectionSocket(): void {

        this.ioServer.on("connection", (socket: Socket) => {

            if (!socket.request.session) {
                socket.emit("/authorization", { message: "Authentication failed. You will now be disconnected." });
                socket.disconnect();
            } else {

                //create id
                let chatId = v1();

                //record the user
                this.connectedSockets.set(chatId, socket);
                this.playerNames.set(chatId, socket.request.session.passport.user.nickname);

                socket.emit("/authorization", { id: chatId, name: this.playerNames.get(chatId) });

                //announce player disconnected
                this.sendToMany({ id: chatId, name: "server", message: `${this.playerNames.get(chatId)} joined the game.` }, chatId);

                //init disconnect socket
                this.disconnectSocket(socket);
                this.recieveMessage(socket);

            }
        });
    }

    /**
     * Handles the disconnection of all chat sockets
     */
    private disconnectSocket(givenSocket: Socket): void {

        givenSocket.on("disconnect", () => {
            this.connectedSockets.forEach((socket: Socket, givenId: string) => {

                //check if the leaving socket is the current one
                if (socket.id == givenSocket.id) {

                    //delete client socket
                    this.connectedSockets.delete(givenId);

                    //announce player disconnected
                    this.sendToMany({ id: givenId, name: "server", message: `${this.playerNames.get(givenId)} left the game.` });

                    //remove player name
                    this.playerNames.delete(givenId);
                }
            });
        });

    }

    /**
     * Handles recieving messages from any chat sockets
     */
    private recieveMessage(givenSocket: Socket): void {
        givenSocket.on("/sendMessage", (message: IMessage) => {
            //is it a command?
            if (message.message[0] === "/") return this.processCommand(message);

            //relay to others
            this.sendToMany(message);
        });
    }

    /**
     * Process a command that was recieved from a client
     */
    private processCommand(givenMessage: IMessage): void {
        if (this.commandsEnabled) {
            //TODO later
            //any message that starts with a '/' will be treated as a command. if its
            //incorrect then it will send an error message to the sending client. If it
            //is correct then it will put on a stack to be executed for the purpose of
            //the command
        } else {

            //create message
            let message: IMessage = {
                id: v1(),
                reciever: givenMessage.id,
                name: "server",
                message: "This server does not have commands enabled",
                color: 0xff0000
            }
            this.sendToOne(message);
        }
    }
}