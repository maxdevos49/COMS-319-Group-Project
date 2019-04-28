import socketIO, { Server } from "socket.io";
import socketIOClient from "socket.io-client";
import session from "express-session";

import { expect } from "chai";

import { GameServer } from '../../src/game/GameServer';
import { PlayerInfo } from "../../src/public/javascript/game/models/PlayerInfo";
import { IObjectDescription } from "../../src/public/javascript/game/models/objects/Descriptions/IObjectDescription";
import { TerrainMap } from "../../src/public/javascript/game/models/TerrainMap";
import { IEvent, EventType } from "../../src/public/javascript/game/models/objects/IEvent";
import { HealthEvent } from "../../src/public/javascript/game/models/objects/HealthEvent";

describe('Game server', () => {
    const gameSocket: Server = socketIO(4223);
    let gameServer: GameServer;

    beforeEach(() => {
        gameServer = new GameServer(gameSocket);
    });

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
        expect(gameServer).to.have.property('clients').with.lengthOf(0);
    });

    it('should accept client connections to game server', (done) => {
        let clientSocket: SocketIOClient.Socket = socketIOClient("http://localhost:4223/games/" + gameServer.serverId);
        // Wait until the client socket has connected with the server this will timeout if it doesn't work
        clientSocket.on("connect", () => {
            expect(clientSocket.connected).to.equal(true);
            done();
        });
    });

    it('should have one element in clients list when a connection handshake is completed', (done) => {
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
        let clientSocket: SocketIOClient.Socket = socketIOClient("http://localhost:4223/games/" + gameServer.serverId);
        // Wait until the first client has connected
        clientSocket.on("/init/assignid", (id: string) => {
            clientSocket.on("/update/objects/new", (updates: IObjectDescription[]) => {
                // console.log(updates);
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
        let clientSocket: SocketIOClient.Socket = socketIOClient("http://localhost:4223/games/" + gameServer.serverId);

        clientSocket.on("/init/terrain", (map: TerrainMap) => {
            expect(map).to.deep.equal(gameServer.simulation.map);
            done();
        });
    });

    it('Should send events to the correct client', (done) => {
        let clientSocket: SocketIOClient.Socket = socketIOClient("http://localhost:4223/games/" + gameServer.serverId);
        clientSocket.on("connect", () => {
            const uuid: string = gameServer.clients.keys().next().value;
            const newHealth: number = 50;
            gameServer.simulation.events.push(new HealthEvent(uuid, newHealth));
            gameServer.simulation.events.push(new HealthEvent("eventForOtherPlayer", newHealth));
            clientSocket.on("/update/event", (event: IEvent) => {
                const temp = event as HealthEvent;
                expect(temp.forPlayerId).to.equal(uuid);
                expect(temp.type).to.equal(EventType.Health);
                expect(temp.setHealthTo).to.equal(newHealth);
            });
            done();
        });
    });

    it('Should remove events after sending', (done) => {
        let clientSocket: SocketIOClient.Socket = socketIOClient("http://localhost:4223/games/" + gameServer.serverId);
        clientSocket.on("connect", () => {
            const uuid: string = gameServer.clients.keys().next().value;
            const newHealth: number = 50;
            gameServer.simulation.events.push(new HealthEvent(uuid, newHealth));
            clientSocket.on("/update/event", () => {
                expect(gameServer.simulation.events.length).to.equal(0);
            });
            done();
        });
    });
});
