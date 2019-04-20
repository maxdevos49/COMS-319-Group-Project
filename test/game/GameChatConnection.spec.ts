import { expect } from 'chai';
import socketIO, { Server } from "socket.io";
import socketIOClient from "socket.io-client";
import session from "express-session";
import { ChatServer } from '../../src/game/ChatServer';
import { IMessage } from '../../src/public/javascript/game/models/objects/IMessage';

let port = 4444;
let chatSocket: Server;

describe('Chat Server', () => {


    it("Should be denied connection due to lack of session", (done) => {
        chatSocket = socketIO(port);
        let chatServer = new ChatServer("id", chatSocket);
        let clientSocket: SocketIOClient.Socket = socketIOClient(`http://localhost:${port}/chat/id`);

        clientSocket.on("/authorization", (data: any) => {
            expect(data.message).equals("Authentication failed. You will now be disconnected.");
            done();
        })
    });


    it("Should connect to the chat Server", (done) => {
        port++;
        chatSocket = socketIO(port);
        addSession();
        let chatServer = new ChatServer("id", chatSocket);
        let clientSocket: SocketIOClient.Socket = socketIOClient(`http://localhost:${port}/chat/id`);

        clientSocket.on("/authorization", (data: any) => {
            expect(data.message).to.be.undefined;
            done();
        })
    });

    it("Server should recieve a message and forward it back", (done) => {
        port++;
        chatSocket = socketIO(port);
        addSession();
        let chatServer = new ChatServer("id", chatSocket);
        let clientSocket: SocketIOClient.Socket = socketIOClient(`http://localhost:${port}/chat/id`);

        clientSocket.on("/authorization", (data: any) => {
            let message: IMessage = {
                id: data.id,
                message: "This is a test",
                name: data.name,
                color: 0x00ff00
            };

            clientSocket.emit("/sendMessage", message);

            clientSocket.on("/newMessage", (givenMessage: IMessage) => {
                expect(givenMessage.message).is.not.undefined;
                done();
            })
        })
    });

    it("Server should forward the correct id", (done) => {
        port++;
        chatSocket = socketIO(port);
        addSession();
        let chatServer = new ChatServer("id", chatSocket);
        let clientSocket: SocketIOClient.Socket = socketIOClient(`http://localhost:${port}/chat/id`);

        clientSocket.on("/authorization", (data: any) => {
            let message: IMessage = {
                id: data.id,
                message: "This is a test",
                name: data.name,
                color: 0x00ff00
            };

            clientSocket.emit("/sendMessage", message);

            clientSocket.on("/newMessage", (givenMessage: IMessage) => {
                expect(givenMessage.id).equal(message.id);
                done();
            })
        })
    });

    it("Server should forward the correct name", (done) => {
        port++;
        chatSocket = socketIO(port);
        addSession();
        let chatServer = new ChatServer("id", chatSocket);
        let clientSocket: SocketIOClient.Socket = socketIOClient(`http://localhost:${port}/chat/id`);

        clientSocket.on("/authorization", (data: any) => {
            let message: IMessage = {
                id: data.id,
                message: "This is a test",
                name: data.name,
                color: 0x00ff00
            };

            clientSocket.emit("/sendMessage", message);

            clientSocket.on("/newMessage", (givenMessage: IMessage) => {
                expect(givenMessage.name).equal(message.name);
                done();
            })
        })
    });

    it("Server should forward the correct message", (done) => {
        port++;
        chatSocket = socketIO(port);
        addSession();
        let chatServer = new ChatServer("id", chatSocket);
        let clientSocket: SocketIOClient.Socket = socketIOClient(`http://localhost:${port}/chat/id`);

        clientSocket.on("/authorization", (data: any) => {
            let message: IMessage = {
                id: data.id,
                message: "This is a test",
                name: data.name,
                color: 0x00ff00
            };

            clientSocket.emit("/sendMessage", message);

            clientSocket.on("/newMessage", (givenMessage: IMessage) => {
                expect(givenMessage.message).equal(message.message);
                done();
            })
        })
    });

    it("Server should forward the correct color", (done) => {
        port++;
        chatSocket = socketIO(port);
        addSession();
        let chatServer = new ChatServer("id", chatSocket);
        let clientSocket: SocketIOClient.Socket = socketIOClient(`http://localhost:${port}/chat/id`);

        clientSocket.on("/authorization", (data: any) => {
            let message: IMessage = {
                id: data.id,
                message: "This is a test",
                name: data.name,
                color: 0x00ff00
            };

            clientSocket.emit("/sendMessage", message);

            clientSocket.on("/newMessage", (givenMessage: IMessage) => {
                expect(givenMessage.color).equal(message.color);
                done();
            })
        })
    });

    it("Server should forward to the correct reciever", (done) => {
        port++;
        chatSocket = socketIO(port);
        addSession();
        let chatServer = new ChatServer("id", chatSocket);
        let clientSocket: SocketIOClient.Socket = socketIOClient(`http://localhost:${port}/chat/id`);

        clientSocket.on("/authorization", (data: any) => {
            let message: IMessage = {
                id: data.id,
                message: "This is a test",
                name: data.name,
                color: 0x00ff00,
                reciever: data.id
            };

            clientSocket.emit("/sendMessage", message);

            clientSocket.on("/newMessage", (givenMessage: IMessage) => {
                expect(givenMessage.reciever).equal(message.reciever);
                done();
            })
        })
    });

    it("Server should deny commands as they are disabled", (done) => {
        port++;
        chatSocket = socketIO(port);
        addSession();
        let chatServer = new ChatServer("id", chatSocket);
        let clientSocket: SocketIOClient.Socket = socketIOClient(`http://localhost:${port}/chat/id`);

        clientSocket.on("/authorization", (data: any) => {
            let message: IMessage = {
                id: data.id,
                message: "/This is a test",
                name: data.name,
                color: 0x00ff00,
                reciever: data.id
            };

            clientSocket.emit("/sendMessage", message);

            clientSocket.on("/newMessage", (givenMessage: IMessage) => {
                expect(givenMessage.message).equal("This server does not have commands enabled");
                expect(givenMessage.color).equal(0xff0000);
                expect(givenMessage.id).not.equal(message.id);
                expect(givenMessage.reciever).equal(message.id);
                expect(givenMessage.name).equal("server");
                done();
            })
        })
    });

});


function addSession() {
    let sessionMiddleware = session({ secret: "secret", resave: false, saveUninitialized: false });

    chatSocket.use(function (socket, next) {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    chatSocket.use(function (socket, next) {
        socket.request.session = {
            passport: {
                user: {
                    id: "givenidfromdb",
                    nickname: "BobTheBuilder",
                    email: "bob@buildthat.com"
                }
            }
        }
        next();
    });
}