import socketIO, { Server } from "socket.io";
import socketIOClient from "socket.io-client";
import session from "express-session";

import { expect } from "chai";

import { GameServer } from '../../src/game/GameServer';
import { PlayerInfo } from "../../src/public/javascript/game/models/PlayerInfo";
import { IObjectDescription } from "../../src/public/javascript/game/models/objects/IObjectDescription";
import { TerrainMap } from "../../src/public/javascript/game/models/TerrainMap";


describe('Game server', () => {
    const gameSocket: Server = socketIO(4223);

    let sessionMiddleware = session({ secret: "secret", resave: false, saveUninitialized: false });

    gameSocket.use(function (socket, next) {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    gameSocket.use(function (socket, next) {
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


    it('should initialize with an empty list of clients', () => {
        const gameServer: GameServer = new GameServer(gameSocket);
        expect(gameServer).to.have.property('clients').with.lengthOf(0);
    });

    it('should accept client connections to game server', (done) => {
        const gameServer: GameServer = new GameServer(gameSocket);
        let clientSocket: SocketIOClient.Socket = socketIOClient("http://localhost:4223/games/" + gameServer.serverId);
        // Wait until the client socket has connected with the server this will timeout if it doesn't work
        clientSocket.on("connect", () => {
            expect(clientSocket.connected).to.equal(true);
            done();
        });
    });

    it('should have one element in clients list when a connection handshake is completed', (done) => {
        const gameServer: GameServer = new GameServer(gameSocket);
        let clientSocket: SocketIOClient.Socket = socketIOClient("http://localhost:4223/games/" + gameServer.serverId);
        // Wait until client has connected to the server
        clientSocket.on("connect", () => {
            // When the handshake is complete server will emit this to this client
            clientSocket.on("/init/assignid", () => {
                expect(gameServer).to.have.property('clients').with.lengthOf(1);
                done();
            });
        });
    });

    it('should receive information about new  players from the server', (done) => {
        const gameServer: GameServer = new GameServer(gameSocket);
        let firstClientSocket: SocketIOClient.Socket = socketIOClient("http://localhost:4223/games/" + gameServer.serverId);
        // Wait until the first client has connected
        firstClientSocket.on("connect", () => {
            // Once the first client has completed their handshake
            firstClientSocket.on("/init/assignid", (id: string) => {
                let secondClientSocket: SocketIOClient.Socket = socketIOClient("http://localhost:4223/games/" + gameServer.serverId);
                // Wait until the second client has connected
                secondClientSocket.on("connect", () => {
                    // This will be sent as the last step of the handshake
                    secondClientSocket.on("/update/player/new", (otherPlayer: PlayerInfo) => {
                        // We should receive an update containing the first players id
                        expect(otherPlayer).to.have.property('id').equals(id);
                        done();
                    });
                });
            });
        });
    });

    it('should send new object for the player', (done) => {
        const gameServer: GameServer = new GameServer(gameSocket);
        let clientSocket: SocketIOClient.Socket = socketIOClient("http://localhost:4223/games/" + gameServer.serverId);
        // Wait until the first client has connected
        clientSocket.on("/init/assignid", (id: string) => {
            clientSocket.on("/update/objects/new", (updates: IObjectDescription[]) => {
                console.log(updates);
                // Wait until the updates contains the player
                let index = updates.findIndex((update: IObjectDescription) => update.id === id);
                if (index != -1) {
                    expect(updates[index]).to.have.property("id").that.equals(id);
                    clientSocket.close();
                    done();
                }
            });
        });
    });

    it('Should send a terrain map', (done) => {
        const gameServer: GameServer = new GameServer(gameSocket);
        let clientSocket: SocketIOClient.Socket = socketIOClient("http://localhost:4223/games/" + gameServer.serverId);

        clientSocket.on("/init/terrain", (map: TerrainMap) => {
            expect(map).to.deep.equal(gameServer.simulation.map);
            done();
        });
    });
});