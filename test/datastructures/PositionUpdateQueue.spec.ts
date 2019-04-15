import {expect} from "chai";
import {PositionUpdateQueue} from "../../src/public/javascript/data-structures/PositionUpdateQueue";
import {IPositionUpdate} from "../../src/public/javascript/models/game/objects/IPositionUpdate";

describe("Position update queue", () => {
   it("should initialize with no updates", () => {
       let queue: PositionUpdateQueue = new PositionUpdateQueue();
       expect(queue).to.have.property("updates").that.has.property("size").that.equals(0);
       expect(queue.popUpdate("test")).to.be.null;
   });
   it("should store new position updates", () => {
       let queue: PositionUpdateQueue = new PositionUpdateQueue();
       let testUpdate1: IPositionUpdate = {frame: 0, id: "testid1", x: 0, y: 0};
       let testUpdate2: IPositionUpdate = {frame: 0, id: "testid2", x: 0, y: 0};
       queue.addUpdate(testUpdate1);
       queue.addUpdate(testUpdate2);
       expect(queue.popUpdate("testid1")).to.equal(testUpdate1);
       expect(queue.popUpdate("testid2")).to.equal(testUpdate2);
   });
   it("should pop the same update only once", () => {
       let queue: PositionUpdateQueue = new PositionUpdateQueue();
       let testUpdate: IPositionUpdate = {frame: 0, id: "testid1", x: 0, y: 0};
       queue.addUpdate(testUpdate);
       expect(queue.popUpdate("testid1")).to.equal(testUpdate);
       expect(queue.popUpdate("testid1")).to.be.null;
   });
   it("should overwrite old updates with new updates", () => {
       let queue: PositionUpdateQueue = new PositionUpdateQueue();
       let testUpdateOld: IPositionUpdate = {frame: 0, id: "testid1", x: 0, y: 0};
       let testUpdateNew: IPositionUpdate = {frame: 1, id: "testid1", x: 0, y: 0};
       queue.addUpdate(testUpdateOld);
       queue.addUpdate(testUpdateNew);
       expect(queue.popUpdate("testid1")).to.equal(testUpdateNew);
       // Should work both ways
       queue.addUpdate(testUpdateNew);
       queue.addUpdate(testUpdateOld);
       expect(queue.popUpdate("testid1")).to.equal(testUpdateNew);
   });
});