import {expect} from "chai";
import {TerrainMap} from "../../src/public/javascript/models/game/TerrainMap";

describe("Terrain Map", () => {
	it("Should initialize a map with the given width and height", () => {
		let testMap: TerrainMap = new TerrainMap(10, 15, 0);
		expect(testMap).to.have.property("width").that.equals(10);
		expect(testMap).to.have.property("height").that.equals(15);
		expect(testMap.map).to.have.length(15);
		expect(testMap.map[0]).to.have.length(10);
	});
	it("Should fill the map array with the default value", () => {
		let testMap: TerrainMap = new TerrainMap(10, 15, 4);
		testMap.map.forEach((row: number[]) => {
			row.forEach((tile: number) => expect(tile).to.equal(4));
		});
	});
});