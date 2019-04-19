export interface IMessage {
    /**
     * The id of the sender
     */
    id: string;

    /**
     * The reciever of the message if there is a specific one
     */
    reciever?: string;

    /**
     * The message contents
     */
    message: string;

    /**
     * Name of the sender
     */
    name?: string;

    /**
     * The color of the message
     */
    color?: number;

}