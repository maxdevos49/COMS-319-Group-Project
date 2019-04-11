import { expect } from 'chai';
import socketIO, { Namespace, Server } from "socket.io";
import socketIOClient from "socket.io-client";

import { GameServer } from '../../src/game/GameServer';
import { GameConnection } from '../../src/public/javascript/game/GameConnection.js';
import { PlayerMoveUpdate, PlayerMoveDirection } from '../../src/public/javascript/game/models/game/PlayerMoveUpdate';

describe('GameConnection', () => {
    const serverSocket: Server = socketIO(6593);

    // TODO: Figure out way to test the game connection
});