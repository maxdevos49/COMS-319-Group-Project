import {expect} from "chai";
import {PlayerMoveUpdateQueue} from "../../src/public/javascript/data-structures/PlayerMoveUpdateQueue";
import {PlayerMoveDirection, PlayerMoveUpdate} from "../../src/public/javascript/models/game/PlayerMoveUpdate";

describe("Player Move Update Queue", () => {
   it("Should initialize without a player move update for a given player", () => {
      let moveUpdateQueue: PlayerMoveUpdateQueue = new PlayerMoveUpdateQueue(10);
      expect(moveUpdateQueue.popPlayerMoveUpdate("testid1")).is.null;
   });

   it("Should remove frames that retroactively become past the max frame lag because of calls to increment frame", () => {
       let moveUpdateQueue: PlayerMoveUpdateQueue = new PlayerMoveUpdateQueue(1);
       let testMoveUpdate: PlayerMoveUpdate = new PlayerMoveUpdate("testid1", 0, 0, false, PlayerMoveDirection.None);
       moveUpdateQueue.addPlayerMoveUpdate(testMoveUpdate);
       moveUpdateQueue.incrementFrame();
       moveUpdateQueue.incrementFrame();
       expect(moveUpdateQueue.popPlayerMoveUpdate("testid1")).is.null;
   });

   it("Should store a move updates that are not past max frame lag for a player with a given id", () => {
       let moveUpdateQueue: PlayerMoveUpdateQueue = new PlayerMoveUpdateQueue(10);
       let testMoveUpdate1: PlayerMoveUpdate = new PlayerMoveUpdate("testid1", 0, 0, false, PlayerMoveDirection.None);
       let testMoveUpdate2: PlayerMoveUpdate = new PlayerMoveUpdate("testid2", 0, 180, true, PlayerMoveDirection.None);
       moveUpdateQueue.addPlayerMoveUpdate(testMoveUpdate1);
       moveUpdateQueue.addPlayerMoveUpdate(testMoveUpdate2);
       expect(moveUpdateQueue.popPlayerMoveUpdate("testid1")).equals(testMoveUpdate1);
       expect(moveUpdateQueue.popPlayerMoveUpdate("testid2")).equals(testMoveUpdate2);
       // Test aliased updates work as expected
       moveUpdateQueue.incrementFrame();
       moveUpdateQueue.addPlayerMoveUpdate(testMoveUpdate1);
       expect(moveUpdateQueue.popPlayerMoveUpdate("testid1")).equals(testMoveUpdate1);
   });

   it("Should alias the most recent frame update as the next and remove older ones", () => {
       let moveUpdateQueue: PlayerMoveUpdateQueue = new PlayerMoveUpdateQueue(10);
       let testMoveUpdateOld: PlayerMoveUpdate = new PlayerMoveUpdate("testid1", 0, 0, false, PlayerMoveDirection.None);
       let testMoveUpdateNew: PlayerMoveUpdate = new PlayerMoveUpdate("testid1", 1, 180, false, PlayerMoveDirection.None);
       moveUpdateQueue.incrementFrame();
       moveUpdateQueue.incrementFrame();
       moveUpdateQueue.addPlayerMoveUpdate(testMoveUpdateOld);
       moveUpdateQueue.addPlayerMoveUpdate(testMoveUpdateNew);
       expect(moveUpdateQueue.popPlayerMoveUpdate("testid1")).equals(testMoveUpdateNew);
   });

   it("Should alias future updates as the next frame if not to far in the future", () => {
       let moveUpdateQueue: PlayerMoveUpdateQueue = new PlayerMoveUpdateQueue(10, 10);
       let testMoveUpdateFuture: PlayerMoveUpdate = new PlayerMoveUpdate("testid1", 5, 0, false, PlayerMoveDirection.None);
       let testMoveUpdateFarFuture: PlayerMoveUpdate = new PlayerMoveUpdate("testid1", 15, 180, true, PlayerMoveDirection.None);
       moveUpdateQueue.addPlayerMoveUpdate(testMoveUpdateFuture);
       moveUpdateQueue.addPlayerMoveUpdate(testMoveUpdateFarFuture);
       expect(moveUpdateQueue.popPlayerMoveUpdate("testid1")).equals(testMoveUpdateFuture);
   })

   it("Should not pop the same move update more than once", () => {
       let moveUpdateQueue: PlayerMoveUpdateQueue = new PlayerMoveUpdateQueue(10);
       let testMoveUpdate: PlayerMoveUpdate = new PlayerMoveUpdate("testid1", 0, 0, false, PlayerMoveDirection.None);
       moveUpdateQueue.addPlayerMoveUpdate(testMoveUpdate);
       expect(moveUpdateQueue.popPlayerMoveUpdate("testid1")).equals(testMoveUpdate);
       expect(moveUpdateQueue.popPlayerMoveUpdate("testid1")).is.null;
   });

   it("Should refuse updates that are past the max frame lag", () => {
       let moveUpdateQueue: PlayerMoveUpdateQueue = new PlayerMoveUpdateQueue(0);
       moveUpdateQueue.incrementFrame();
       moveUpdateQueue.addPlayerMoveUpdate(new PlayerMoveUpdate("testid1", 0, 0, false, PlayerMoveDirection.None));
       expect(moveUpdateQueue.popPlayerMoveUpdate(("testid1"))).is.null;
   });
});