import { expect } from 'chai';
import { Server } from "socket.io";
import express from "express";
import http from "http";
import socketIO from "socket.io";

import { GameServer } from '../../src/controllers/GameServer';

describe('Game server', () => {
  const app: express.Application = express();
  const server: http.Server = http.createServer(app);
  const gameSocket: Server = socketIO(server);

  it('should initialize with an empty list of clients', () => {
    const gameServer: GameServer = new GameServer(gameSocket);
    expect(gameServer).to.have.property('clients').with.lengthOf(0);
  });
});