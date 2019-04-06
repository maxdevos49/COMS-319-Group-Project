import { expect } from 'chai';
import socketIO, {Server} from "socket.io";
import socketIOClient from "socket.io-client";

import { GameServer } from '../../src/controllers/GameServer';
import { GameConnection } from '../../src/public/javascript/game/GameConnection.js';
import { PlayerMoveUpdate, PlayerMoveDirection } from '../../src/public/javascript/models/game/PlayerMoveUpdate';

describe('GameConnection', () => {
  const serverSocket: Server = socketIO(6593);

  it('should send move updates to the server', (done) => {
    const gameServer: GameServer = new GameServer(serverSocket);
    // const gameConnection: GameConnection = new GameConnection();
    const move: PlayerMoveUpdate = new PlayerMoveUpdate("1", 0, 0, false, PlayerMoveDirection.None);
    const clientSocket: SocketIOClient.Socket = socketIOClient("http://localhost:6593/games/" + gameServer.serverId);

    clientSocket.on("connect", () => {
        // Perform handshake
        clientSocket.on("/update/begingame", () => done());
        clientSocket.emit("/update/assignname", "test");

        // gameConnection.sendMove(move);
        clientSocket.emit("/update/playermove", move);
    });

    gameServer.gameSocket.on('/update/playermove', (newUpdate: PlayerMoveUpdate) => {
      expect(newUpdate).to.equal(move);
      done();
    });
  });
});