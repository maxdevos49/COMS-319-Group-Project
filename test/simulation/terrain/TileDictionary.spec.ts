import {expect} from "chai";
import { ITile } from "../../../src/game/simulation/terrain/tiles/ITile";
import { TileDictionary } from "../../../src/game/simulation/terrain/tiles/TileDictionary";

describe("Tile Dictionary", () => {
    let tiles: ITile[] = [
        {
            id: 1,
            name: "testtile1",
            groups: ["@testgroup1", "@testgroup2"],
            layer: "testlayer1"
        },
        {
            id: 2,
            name: "testtile2",
            groups: ["@testgroup2"],
            layer: "testlayer1"
        }
    ];

    let tileDict: TileDictionary;
    before(() => {
        tileDict = new TileDictionary(tiles);
    });

    it("Should fill both maps with the given tiles", () => {
        expect(tileDict.tiles_name.size).equals(tiles.length);
        expect(tileDict.tiles_id.size).equals(tiles.length);
    });

    it("Should fill name map with name to ITiles", () => {
        expect(tileDict.tiles_name.get("testtile1")).is.not.undefined;
        expect(tileDict.tiles_name.get("testtile2")).is.not.undefined;
        expect(tileDict.tiles_name.get("testtile3")).is.undefined;
    });

    it("Should fill index map with index to ITiles", () => {
        expect(tileDict.tiles_id.get(1)).is.not.undefined;
        expect(tileDict.tiles_id.get(2)).is.not.undefined;
        expect(tileDict.tiles_id.get(3)).is.undefined;
    });

    it("isTileInGroup() should identify whether a given tile by name is in a group", () => {
        expect(tileDict.isTileInGroup("testtile1", "@testgroup1")).to.be.true;
        expect(tileDict.isTileInGroup("testtile1", "@testgroup2")).to.be.true;
        expect(tileDict.isTileInGroup("testtile2", "@testgroup1")).to.be.false;
        expect(tileDict.isTileInGroup("testtile2", "@testgroup2")).to.be.true;
    });

    it("isTileIndexInGroup() should identify whether a given tile by index is in a group", () => {
        expect(tileDict.isTileIndexInGroup(1, "@testgroup2")).to.be.true;
        expect(tileDict.isTileIndexInGroup(1, "@testgroup1")).to.be.true;
        expect(tileDict.isTileIndexInGroup(2, "@testgroup1")).to.be.false;
        expect(tileDict.isTileIndexInGroup(2, "@testgroup2")).to.be.true;
    });

    it("checkTileIdentifiesAs() should match a tile name with a tile name", () => {
        expect(tileDict.checkTileIdentifiesAs("testtile1", "testtile1")).to.be.true;
        expect(tileDict.checkTileIdentifiesAs("testtile1", "testtile2")).to.be.false;
        expect(tileDict.checkTileIdentifiesAs("testtile2", "testtile2")).to.be.true;
        expect(tileDict.checkTileIdentifiesAs("testtile2", "testtile1")).to.be.false;
    });

    it("checkTileIdentifiesAs() should match a tile with one of its groups", () => {
        expect(tileDict.checkTileIdentifiesAs("testtile1", "@testgroup1")).to.be.true;
        expect(tileDict.checkTileIdentifiesAs("testtile1", "@testgroup2")).to.be.true;
        expect(tileDict.checkTileIdentifiesAs("testtile1", "@testgroup3")).to.be.false;
        expect(tileDict.checkTileIdentifiesAs("testtile2", "@testgroup1")).to.be.false;
        expect(tileDict.checkTileIdentifiesAs("testtile2", "@testgroup2")).to.be.true;
    });

    it("checkTileIdentifiesAs() should allow '|' (or) statements", () => {
        expect(tileDict.checkTileIdentifiesAs("testtile1", "@testgroup1|testtile1")).to.be.true;
        expect(tileDict.checkTileIdentifiesAs("testtile1", "@testgroup3|testtile1")).to.be.true;
        expect(tileDict.checkTileIdentifiesAs("testtile2", "@testgroup1|@testgroup2")).to.be.true;
        expect(tileDict.checkTileIdentifiesAs("testtile2", "@testgroup1|@testgroup3")).to.be.false;
    });

    it("checkTileIndexIdentifiesAs() should match a tile name with a tile name", () => {
        expect(tileDict.checkTileIndexIdentifiesAs(1, "testtile1")).to.be.true;
        expect(tileDict.checkTileIndexIdentifiesAs(1, "testtile2")).to.be.false;
        expect(tileDict.checkTileIndexIdentifiesAs(2, "testtile2")).to.be.true;
        expect(tileDict.checkTileIndexIdentifiesAs(2, "testtile1")).to.be.false;
    });

    it("checkTileIdentifiesAs() should match a tile with one of its groups", () => {
        expect(tileDict.checkTileIndexIdentifiesAs(1, "@testgroup1")).to.be.true;
        expect(tileDict.checkTileIndexIdentifiesAs(1, "@testgroup2")).to.be.true;
        expect(tileDict.checkTileIndexIdentifiesAs(2, "@testgroup3")).to.be.false;
        expect(tileDict.checkTileIndexIdentifiesAs(2, "@testgroup1")).to.be.false;
        expect(tileDict.checkTileIndexIdentifiesAs(2, "@testgroup2")).to.be.true;
    });

    it("checkTileIdentifiesAs() should allow '|' (or) statements", () => {
        expect(tileDict.checkTileIndexIdentifiesAs(1, "@testgroup1|testtile1")).to.be.true;
        expect(tileDict.checkTileIndexIdentifiesAs(1, "@testgroup3|testtile1")).to.be.true;
        expect(tileDict.checkTileIndexIdentifiesAs(2, "@testgroup1|@testgroup2")).to.be.true;
        expect(tileDict.checkTileIndexIdentifiesAs(2, "@testgroup1|@testgroup3")).to.be.false;
    });

});