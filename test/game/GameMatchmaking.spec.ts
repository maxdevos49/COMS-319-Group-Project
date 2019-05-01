import { expect } from "chai";
import socketIO, { Server } from "socket.io";
import socketIOClient from "socket.io-client";

import { GamesList } from "../../src/public/javascript/game/models/GamesList";
import { GameServer } from "../../src/game/GameServer";
import { GameMatchmaking } from "../../src/game/GameMatchmaking";
import session from "express-session";
import { PlayerInfo } from "../../src/public/javascript/game/models/PlayerInfo";

describe('Game Matchmaking', () => {
    const gameSocket: Server = socketIO(4224);

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
                    email: "bob@buildthat.com",
                    roles: "admin"
                }
            }
        };
        next();
    });

    let matchmaking: GameMatchmaking;

    beforeEach(() => {
        // Remove any old games namespace
        delete gameSocket.nsps["/games"];
        matchmaking = new GameMatchmaking(gameSocket, false);
    });

    it('should initialize with 1 game', () => {
        expect(matchmaking).has.property("games").that.has.length(1);
    });

    it("should point players to game when enough have connected", (done) => {
        for (let i = 0; i < GameMatchmaking.numPlayerToStart; i++) {
            let clientSocket: SocketIOClient.Socket = socketIOClient("http://localhost:4224/games");
            // Prevent done from being called multiple times by adding a route to only the first client
            if (i == 0) {
                clientSocket.on("/update/start", (id: string) => {
                    expect(matchmaking.games.get(id)).to.not.be.undefined;
                    done();
                });
            }
        }
    });

    it("should inform old players of new players", (done) => {
        let oldClientSocket = socketIOClient("http://localhost:4224/games");
        oldClientSocket.on("/update/new/player", (info: PlayerInfo) => {
           expect(info.name).to.equal("BobTheBuilder");
           done();
        });
        let newClientSocket = socketIOClient("http://localhost:4224/games");
    })

    it("should inform players when another player disconnects", (done) => {
        let oldClientSocket = socketIOClient("http://localhost:4224/games");
        oldClientSocket.on("/update/remove/player", (id: string) => {
            expect(id).to.not.be.undefined;
            done();
        });

        let newClientSocket = socketIOClient("http://localhost:4224/games");
        newClientSocket.on("/update/new/player", () => {
            newClientSocket.disconnect();
        });
    });

});