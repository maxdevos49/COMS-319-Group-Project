import {expect} from "chai";
import { StructureConstructor } from "../../../src/game/simulation/terrain/structures/StructureConstructor";
import { ITile } from "../../../src/game/simulation/terrain/tiles/ITile";
import { TileDictionary } from "../../../src/game/simulation/terrain/tiles/TileDictionary";
import { IStructure, IStructurePart } from "../../../src/game/simulation/terrain/structures/IStructure";
import { TerrainMap } from "../../../src/public/javascript/game/models/TerrainMap";

describe("Structure Constructor", () => {
    let tiles: ITile[];
    let struct: IStructure;
    let part1: IStructurePart;
    let part2: IStructurePart;
    let map: TerrainMap;
    let tileDict: TileDictionary;
    let structConstr: StructureConstructor;

    beforeEach(() => {
        tiles = [
            {
                id: 0,
                name: "testbackingtile",
                groups: ["@testbackingtile"],
                layer: "testlayer1"
            },
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

        struct = {
            name: "teststruct",
            rarity: 100,
            generatesOn: "@testbackingtile",
            minParts: 0,
            maxParts: 100,
            path: null
        };

        // A 1x1 test part with connections in all directions
        part1 = {
            name: "testpart1",
            rarity: 100,
            rarity_usage_decrease: 10,
            width: 1,
            height: 1,
            structure: [
                ["testtile1"]
            ],
            connections: [
                {
                    x: 0,
                    y: 0,
                    connection_direction: "west",
                    expects: "testtile1|testtile2",
                    required: false
                },
                {
                    x: 0,
                    y: 0,
                    connection_direction: "east",
                    expects: "testtile1|testtile2",
                    required: false
                },
                {
                    x: 0,
                    y: 0,
                    connection_direction: "north",
                    expects: "testtile1|testtile2",
                    required: false
                },
                {
                    x: 0,
                    y: 0,
                    connection_direction: "south",
                    expects: "testtile1|testtile2",
                    required: false
                },
            ]
        };

        // A 1x1 part with more restrictive connections
        part2 = {
            name: "testpart2",
            rarity: 100,
            rarity_usage_decrease: 10,
            width: 1,
            height: 1,
            structure: [
                ["testtile2"]
            ],
            connections: [
                {
                    x: 0,
                    y: 0,
                    connection_direction: "west",
                    expects: "@testgroup1",
                    required: false
                },
                {x: 0,
                    y: 0,
                    connection_direction: "east",
                    expects: "@testgroup1",
                    required: false
                },
                {
                    x: 0,
                    y: 0,
                    connection_direction: "north",
                    expects: "@testgroup1",
                    required: false
                },
                {
                    x: 0,
                    y: 0,
                    connection_direction: "south",
                    expects: "@testgroup1",
                    required: false
                },
            ]
        };

        tileDict = new TileDictionary(tiles);
        map = new TerrainMap(100, 100, 10, 20, [{name:"testlayer1", level: 0}], tiles);
        structConstr = new StructureConstructor(struct, map, tileDict);
    });

    it("Should initialise with the given map and tiles dictionary", () => {
        expect(structConstr.tiles).to.equal(tileDict);
        expect(structConstr.map).to.equal(map);
    });

    it("Structure constructor should initialize empty", () => {
        expect(structConstr.openConnectionPoints.length).to.equal(0);
        expect(structConstr.placedParts.length).to.equal(0);
    });

    it("Should allow a valid root to be placed and should reflect it's placement internally", () => {
        expect(structConstr.setRoot(part1, 10, 20)).to.be.true;
        expect(structConstr.openConnectionPoints).to.have.length(4);
        expect(structConstr.placedParts).to.have.length(1);
        expect(structConstr.placedParts[0].x).to.equal(10);
        expect(structConstr.placedParts[0].y).to.equal(20);
        // Check all new open connections are located at the part
        structConstr.openConnectionPoints.forEach((cp) => {
            expect(cp.x).to.equal(10);
            expect(cp.y).to.equal(20);
        });
    });

    it("Should allow a part to be placed on the connection on another part", () => {
        expect(structConstr.setRoot(part1, 10, 20)).to.be.true;
        expect(structConstr.attemptPlacePart(part1, structConstr.popOpenConnectionPoint()));
        expect(structConstr.openConnectionPoints).to.have.length(6);
        expect(structConstr.placedParts).to.have.length(2);
    });

    it("Should allow a part to fulfill multiple connections", () => {
        structConstr.setRoot(part1, 10, 20);

        let connectionEastOfFirstPart = structConstr.openConnectionPoints.findIndex((pcp) => {
            return pcp.x == 10 && pcp.y == 20 && pcp.template.connection_direction == "east";
        });
        expect(structConstr.attemptPlacePart(part1, structConstr.popOpenConnectionPoint(connectionEastOfFirstPart))).to.be.true;

        let connectionNorthOfFirstPart = structConstr.openConnectionPoints.findIndex((pcp) => {
            return pcp.x == 10 && pcp.y == 20 && pcp.template.connection_direction == "north";
        });
        expect(structConstr.attemptPlacePart(part1, structConstr.popOpenConnectionPoint(connectionNorthOfFirstPart))).to.be.true;

        let connectionNorthOfSecondPart = structConstr.openConnectionPoints.findIndex((pcp) => {
            return pcp.x == 11 && pcp.y == 20 && pcp.template.connection_direction == "north";
        });
        expect(structConstr.attemptPlacePart(part1, structConstr.popOpenConnectionPoint(connectionNorthOfSecondPart))).to.be.true;

        structConstr.placedParts.forEach((p) => console.log(p.x + " " + p.y));

        expect(structConstr.placedParts).to.have.length(4);
        expect(structConstr.openConnectionPoints).to.have.length(8);
    });

    it("Should accurately revert structure placements", () =>{
        structConstr.setRoot(part1, 10, 20);
        structConstr.attemptPlacePart(part1, structConstr.popOpenConnectionPoint());
        structConstr.attemptPlacePart(part1, structConstr.popOpenConnectionPoint());
        structConstr.attemptPlacePart(part1, structConstr.popOpenConnectionPoint());
        structConstr.revertMoves(1);
        expect(structConstr.placedParts).to.have.length(3);
        structConstr.revertMoves(2);
        expect(structConstr.placedParts).to.have.length(1);
        expect(structConstr.openConnectionPoints).to.have.length(4);
    });

    it("Should accurately revert structures with multiple connections", () => {
        structConstr.setRoot(part1, 10, 20);

        let connectionEastOfFirstPart = structConstr.openConnectionPoints.findIndex((pcp) => {
            return pcp.x == 10 && pcp.y == 20 && pcp.template.connection_direction == "east";
        });
        structConstr.attemptPlacePart(part1, structConstr.popOpenConnectionPoint(connectionEastOfFirstPart));

        let connectionNorthOfFirstPart = structConstr.openConnectionPoints.findIndex((pcp) => {
            return pcp.x == 10 && pcp.y == 20 && pcp.template.connection_direction == "north";
        });
        structConstr.attemptPlacePart(part1, structConstr.popOpenConnectionPoint(connectionNorthOfFirstPart));

        let connectionNorthOfSecondPart = structConstr.openConnectionPoints.findIndex((pcp) => {
            return pcp.x == 11 && pcp.y == 20 && pcp.template.connection_direction == "north";
        });
        structConstr.attemptPlacePart(part1, structConstr.popOpenConnectionPoint(connectionNorthOfSecondPart));

        structConstr.revertMoves(1);
        expect(structConstr.placedParts).to.have.length(3);
        expect(structConstr.openConnectionPoints).to.have.length(8);

        structConstr.revertMoves(1);
        expect(structConstr.placedParts).to.have.length(2);
        expect(structConstr.openConnectionPoints).to.have.length(6);

        structConstr.revertMoves(1);
        expect(structConstr.placedParts).to.have.length(1);
        expect(structConstr.openConnectionPoints).to.have.length(4);
    });

    it("Should allow parts to connect if they expect the same group", () => {
        structConstr.setRoot(part1, 10, 20);

        let connectionEastOfFirstPart = structConstr.openConnectionPoints.findIndex((pcp) => {
            return pcp.x == 10 && pcp.y == 20 && pcp.template.connection_direction == "east";
        });
        expect(structConstr.attemptPlacePart(part2, structConstr.popOpenConnectionPoint(connectionEastOfFirstPart))).to.be.true;
    });

    it("Should not allow parts to connect if they expect a different group group", () => {
        structConstr.setRoot(part1, 10, 20);

        let connectionEastOfFirstPart = structConstr.openConnectionPoints.findIndex((pcp) => {
            return pcp.x == 10 && pcp.y == 20 && pcp.template.connection_direction == "east";
        });
        expect(structConstr.attemptPlacePart(part2, structConstr.popOpenConnectionPoint(connectionEastOfFirstPart))).to.be.true;

        let connectionEastOfSecondPart = structConstr.openConnectionPoints.findIndex((pcp) => {
            return pcp.x == 11 && pcp.y == 20 && pcp.template.connection_direction == "east";
        });
        expect(structConstr.attemptPlacePart(part2, structConstr.popOpenConnectionPoint(connectionEastOfSecondPart))).to.be.false;
    });

    it("Should not allow parts to be placed where they invalidate a different connection located there", () => {
        structConstr.setRoot(part1, 10, 20);

        let connectionEastOfFirstPart = structConstr.openConnectionPoints.findIndex((pcp) => {
            return pcp.x == 10 && pcp.y == 20 && pcp.template.connection_direction == "east";
        });
        structConstr.attemptPlacePart(part1, structConstr.popOpenConnectionPoint(connectionEastOfFirstPart));

        let connectionNorthOfFirstPart = structConstr.openConnectionPoints.findIndex((pcp) => {
            return pcp.x == 10 && pcp.y == 20 && pcp.template.connection_direction == "north";
        });
        structConstr.attemptPlacePart(part2, structConstr.popOpenConnectionPoint(connectionNorthOfFirstPart));

        let connectionNorthOfSecondPart = structConstr.openConnectionPoints.findIndex((pcp) => {
            return pcp.x == 11 && pcp.y == 20 && pcp.template.connection_direction == "north";
        });
        expect(structConstr.attemptPlacePart(part2, structConstr.popOpenConnectionPoint(connectionNorthOfSecondPart))).to.be.false;
        // The user of the structure constructor is responsible for re-adding the popped connection point after a failure (for performance reasons)
        expect(structConstr.openConnectionPoints).to.have.length(7);
        expect(structConstr.placedParts).to.have.length(3);
    });

    it("Should decrease a parts rarity by the specified amount after placing it", () => {
        structConstr.setRoot(part1, 10, 20);
        let startRarity: number = part1.rarity;
        expect(structConstr.attemptPlacePart(part1, structConstr.popOpenConnectionPoint())).to.be.true;
        expect(part1.rarity).to.equal(startRarity - part1.rarity_usage_decrease);
        expect(structConstr.attemptPlacePart(part1, structConstr.popOpenConnectionPoint())).to.be.true;
        expect(part1.rarity).to.equal(startRarity - 2 * part1.rarity_usage_decrease);
    });

    it("Should revert rarity decreases", () => {
        structConstr.setRoot(part1, 10, 20);
        let startRarity: number = part1.rarity;
        structConstr.attemptPlacePart(part1, structConstr.popOpenConnectionPoint());
        structConstr.attemptPlacePart(part1, structConstr.popOpenConnectionPoint());
        structConstr.revertMoves(1);
        expect(part1.rarity).to.equal(startRarity - part1.rarity_usage_decrease);
        structConstr.revertMoves(1);
        expect(part1.rarity).to.equal(startRarity);
    });

    it("Should be able to get a block index including placed parts that haven't been committed", () => {
        // Check out of bounds first
        expect(structConstr.getBlockIndexAt(-5, -5)).to.equal(-1);

        expect(structConstr.getBlockIndexAt(10, 20)).to.equal(0);
        expect(structConstr.getBlockIndexAt(11, 20)).to.equal(0);

        structConstr.setRoot(part1, 10, 20);
        expect(structConstr.getBlockIndexAt(10, 20)).to.equal(1);
        expect(structConstr.getBlockIndexAt(11, 20)).to.equal(0);

        let connectionEastOfFirstPart = structConstr.openConnectionPoints.findIndex((pcp) => {
            return pcp.x == 10 && pcp.y == 20 && pcp.template.connection_direction == "east";
        });
        structConstr.attemptPlacePart(part2, structConstr.popOpenConnectionPoint(connectionEastOfFirstPart));
        expect(structConstr.getBlockIndexAt(10, 20)).to.equal(1);
        expect(structConstr.getBlockIndexAt(11, 20)).to.equal(2);
    });

    it("Should be able to safely get the block index of just placed structure (and not return data about the terrain)", () => {
        structConstr.setRoot(part1, 10, 20);
        expect(structConstr.getPlacedStructureBlockIndexAt(structConstr.placedParts[0], 10, 20)).to.equal(1);
        expect(structConstr.getPlacedStructureBlockIndexAt(structConstr.placedParts[0], 11, 20)).to.equal(-1);
    });

    it("Should be able to safely get the name of a block in a structure part", () => {
        expect(structConstr.getStructureTileName(part1, 0, 0)).to.equal("testtile1");
        expect(structConstr.getStructureTileName(part1, 1, 0)).to.equal("");
        expect(structConstr.getStructureTileName(part2, 0, 0)).to.equal("testtile2");
    });

    it("Should place blocks on terrain map with the commit call", () => {
        structConstr.setRoot(part1, 10, 20);
        expect(map.getHighestTile(10, 20)).to.equal(0);
        expect(map.getHighestTile(11, 20)).to.equal(0);
        structConstr.commit();
        expect(map.getHighestTile(10, 20)).to.equal(1);
        expect(map.getHighestTile(11, 20)).to.equal(0);
    });
});