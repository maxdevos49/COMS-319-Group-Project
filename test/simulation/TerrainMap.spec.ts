import { expect } from "chai";
import { TerrainMap } from "../../src/public/javascript/game/models/game/TerrainMap";

describe("Terrain Map", () => {
    it("Should initialize a map with the given width and height", () => {
        let testMap: TerrainMap = new TerrainMap(10, 15, 0);
        expect(testMap).to.have.property("width").that.equals(10);
        expect(testMap).to.have.property("height").that.equals(15);
        expect(testMap.data).to.have.length(15);
        expect(testMap.data[0]).to.have.length(10);
    });
    it("Should fill the data array with the default value", () => {
        let testMap: TerrainMap = new TerrainMap(10, 15, 4);
        testMap.data.forEach((row: number[]) => {
            row.forEach((tile: number) => expect(tile).to.equal(4));
        });
    });
});