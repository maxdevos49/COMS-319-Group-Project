import socketIO, {Server} from "socket.io";
import socketIOClient from "socket.io-client";

import {expect} from "chai";

import {GameServer} from '../../src/controllers/GameServer';
import {PlayerUpdate} from "../../src/public/javascript/models/games/PlayerUpdate";
import {PlayerMoveDirection, PlayerMoveUpdate} from "../../src/public/javascript/models/game/PlayerMoveUpdate";
import {PositionUpdate} from "../../src/public/javascript/models/game/PositionUpdate";


describe('Game server', () => {
  const gameSocket: Server = socketIO(4223);

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
          clientSocket.on("/update/begingame", () => {
              expect(gameServer).to.have.property('clients').with.lengthOf(1);
              done();
          });

          // Send the server your name to complete the handshake
          clientSocket.emit("/update/assignname", "test");
      });
  });

  it('should receive information about other players from the server', (done) => {
      const gameServer: GameServer = new GameServer(gameSocket);
      let firstClientSocket: SocketIOClient.Socket = socketIOClient("http://localhost:4223/games/" + gameServer.serverId);
      // Wait until the first client has connected
      firstClientSocket.on("connect", () => {
          // Once the first client has completed their handshake
          firstClientSocket.on("/update/begingame", () => {
              let secondClientSocket: SocketIOClient.Socket = socketIOClient("http://localhost:4223/games/" + gameServer.serverId);
              // Wait until the second client has connected
              secondClientSocket.on("connect", () => {
                  // This will be sent as the last step of the handshake
                  secondClientSocket.on("/update/playerupdate", (otherPlayer: PlayerUpdate) => {
                      // We should receive an update containing the first players name
                      expect(otherPlayer).to.have.property('name').equals('client1');
                      done();
                  });
                  // Complete the second clients handshake
                  secondClientSocket.emit("/update/assignname", "client2");
              });
          });
          // Complete the first clients handshake
          firstClientSocket.emit("/update/assignname", "client1");
      });
  });

  it('should send send position updates to client', (done) => {
      const gameServer: GameServer = new GameServer(gameSocket);
      let clientSocket: SocketIOClient.Socket = socketIOClient("http://localhost:4223/games/" + gameServer.serverId);
      // Wait until the first client has connected
      clientSocket.on("connect", () => {
          // Complete the first clients handshake
          clientSocket.emit("/update/assignname", "client1");
      });

      clientSocket.on("/update/assignid", (id: string) => {
          clientSocket.on("/update/position", (update: PositionUpdate[]) => {
              // Player should be added eventually
              if (update.length != 0) {
                  expect(update).to.have.property("id").that.equals(id);
                  done();
              }
          });
      });
  });
});