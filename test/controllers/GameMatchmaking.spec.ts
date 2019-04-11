import { expect } from "chai";
import socketIO, { Server } from "socket.io";
import socketIOClient from "socket.io-client";

import { GameMatchmaking } from "../../src/game/GameMatchmaking";
import { GamesList } from "../../src/public/javascript/game/models/games/GamesList";
import { GameServer } from "../../src/game/GameServer";

describe('Game Matchmaking', () => {
    const gameSocket: Server = socketIO(4224);
    let matchmaking: GameMatchmaking = new GameMatchmaking(gameSocket);

    it('should initialize with 1 game', () => {
        expect(matchmaking).has.property("games").that.has.length(1);
    });

    it('should list games at endpoint', (done) => {
        let clientSocket: SocketIOClient.Socket = socketIOClient("http://localhost:4224/games");
        // Behaviour when the game server sends a games list
        clientSocket.on("/list", (gamesList: GamesList) => {
            expect(gamesList).has.property("gameIds").deep.equals(matchmaking.games.map((game: GameServer) => game.serverId));
            done();
        });
        // Now that the behaviour for the response has been specified request games list
        clientSocket.emit("/list");//triggers the list
    })
});