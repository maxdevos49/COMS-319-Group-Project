import { expect } from "chai";
import socketIO, { Server } from "socket.io";
import socketIOClient from "socket.io-client";

import { GamesList } from "../../src/public/javascript/game/models/GamesList";
import { GameServer } from "../../src/game/GameServer";
import { GameMatchmaking } from "../../src/game/GameMatchmaking";

describe('Game Matchmaking', () => {
    const gameSocket: Server = socketIO(4224);
    let matchmaking: GameMatchmaking = new GameMatchmaking(gameSocket);

    it('should initialize with 1 game', () => {
        expect(matchmaking).has.property("games").that.has.length(1);
    });

});