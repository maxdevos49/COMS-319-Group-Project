import { expect } from "chai";
import { TerrainMap } from "../../../src/public/javascript/game/models/TerrainMap";
import { ITile, ITileLayer } from "../../../src/game/simulation/terrain/tiles/ITile";

describe("Terrain Map", () => {
    let tiles: ITile[] = [
        {
            name: "testtile1",
            layer: "testlayer1",
            id: 1,
        }
    ];
    let layers: ITileLayer[] = [
        {
            name: "testlayer1",
            level: 0
        },
        {
            name: "testlayer2",
            level: 2
        }
    ];

    it("Should initialize a map with the given width and height", () => {
        let testMap: TerrainMap = new TerrainMap(10, 15, 10, 20, layers, tiles);
        expect(testMap).to.have.property("width").that.equals(10);
        expect(testMap).to.have.property("height").that.equals(15);
        expect(testMap.layers[0].data).to.have.length(15);
        expect(testMap.layers[0].data[0]).to.have.length(10);
    });

    it("Should fill the data array with the default value", () => {
        let testMap: TerrainMap = new TerrainMap(10, 15, 10, 20, layers, tiles, 5);
        testMap.layers.forEach((layer) => {
            layer.data.forEach((tileIndex) => expect(tileIndex).to.equal(5));
        });
    });

    it("Should allow block indices to be set and retrieved", () => {
        let testMap: TerrainMap = new TerrainMap(10, 15, 10, 20, layers, tiles, 5);
        expect(testMap.getHighestTile(1, 1)).to.equal(5);

        testMap.setBlock("testlayer2", 1, 1, 2);
        expect(testMap.getHighestTile(1, 1)).to.equal(2);
    });

    it("Should return the block index of the highest non-empty layer at a given coordinate", () => {
        let testMap: TerrainMap = new TerrainMap(10, 15, 10, 20, layers, tiles, 5);

        testMap.setBlock("testlayer2", 1, 1, 0);
        expect(testMap.getHighestTile(1, 1)).to.equal(5);

        testMap.setBlock("testlayer1", 1, 1, 2);
        expect(testMap.getHighestTile(1, 1)).to.equal(2);

        testMap.setBlock("testlayer1", 1, 1, 0);
        expect(testMap.getHighestTile(1, 1)).to.equal(0);

        testMap.setBlock("testlayer2", 1, 1, 3);
        expect(testMap.getHighestTile(1, 1)).to.equal(3);
    });
});