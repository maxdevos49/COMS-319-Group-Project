import { expect } from "chai";
import { TerrainMap } from "../../../src/public/javascript/game/models/TerrainMap";
import { ITile} from "../../../src/game/simulation/terrain/tiles/ITile";
import { ITileLayer } from "../../../src/game/simulation/terrain/tiles/ITileLayer";

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
            level: 0,
            collides: false
        },
        {
            name: "testlayer2",
            level: 2,
            collides: false
        }
    ];

    it("Should initialize a map with the given width and height", () => {
        let testMap: TerrainMap = new TerrainMap(10, 15, 10, 20, layers, tiles);
        expect(testMap).to.have.property("width").that.equals(10);
        expect(testMap).to.have.property("height").that.equals(15);
        expect(testMap.layers[0].data).to.have.length(10 * 15);
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