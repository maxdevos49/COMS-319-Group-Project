import {expect} from "chai";
import { StructureConstructor } from "../../src/game/simulation/terrain/structures/StructureConstructor";
import { ITile } from "../../src/game/simulation/terrain/tiles/ITile";
import { TileDictionary } from "../../src/game/simulation/terrain/tiles/TileDictionary";
import { IStructure, IStructurePart } from "../../src/game/simulation/terrain/structures/IStructure";
import { TerrainMap } from "../../src/public/javascript/game/models/TerrainMap";

describe("Structure Constructor", () => {
     let tiles: ITile[] = [
         {
             index: 0,
             name: "testbackingtile",
             groups: ["@testbackingtile"]
         },
         {
            index: 1,
            name: "testtile1",
            groups: ["@testgroup1", "@testgroup2"]
        },
        {
            index: 2,
            name: "testtile2",
            groups: ["@testgroup2"]
        }
     ];

     let struct: IStructure = {
         name: "teststruct",
         rarity: 100,
         generatesOn: "@testbackingtile",
         minParts: 0,
         maxParts: 100,
         path: null
     };

     // A 1x1 test part with connections in all directions
     let part: IStructurePart = {
         name: "testpart",
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
                 expects: "testtile1",
                 required: false
             },
             {
                 x: 0,
                 y: 0,
                 connection_direction: "east",
                 expects: "testtile1",
                 required: false
             },
             {
                 x: 0,
                 y: 0,
                 connection_direction: "north",
                 expects: "testtile1",
                 required: false
             },
             {
                 x: 0,
                 y: 0,
                 connection_direction: "south",
                 expects: "testtile1",
                 required: false
             },
         ]
     };

     let map: TerrainMap;
     let tileDict: TileDictionary;
     let structConstr: StructureConstructor;

     beforeEach(() => {
         tileDict = new TileDictionary(tiles);
         map = new TerrainMap(100, 100, 0, 10, 10);
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
         expect(structConstr.setRoot(part, 10, 20)).to.be.true;
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
         expect(structConstr.setRoot(part, 10, 20)).to.be.true;
         expect(structConstr.attemptPlacePart(part, structConstr.popOpenConnectionPoint()));
         expect(structConstr.openConnectionPoints).to.have.length(6);
         expect(structConstr.placedParts).to.have.length(2);
     });

     it("Should allow a part to fulfill multiple connections", () => {
         structConstr.setRoot(part, 10, 20);

         let connectionEastOfFirstPart = structConstr.openConnectionPoints.findIndex((pcp) => {
             return pcp.x == 10 && pcp.y == 20 && pcp.template.connection_direction == "east";
         });
         expect(structConstr.attemptPlacePart(part, structConstr.popOpenConnectionPoint(connectionEastOfFirstPart))).to.be.true;

         let connectionNorthOfFirstPart = structConstr.openConnectionPoints.findIndex((pcp) => {
             return pcp.x == 10 && pcp.y == 20 && pcp.template.connection_direction == "north";
         });
         expect(structConstr.attemptPlacePart(part, structConstr.popOpenConnectionPoint(connectionNorthOfFirstPart))).to.be.true;

         let connectionNorthOfSecondPart = structConstr.openConnectionPoints.findIndex((pcp) => {
             return pcp.x == 11 && pcp.y == 20 && pcp.template.connection_direction == "north";
         });
         console.log("THAT CONNECTION: " + structConstr.openConnectionPoints[connectionNorthOfSecondPart].template.connection_direction);
         expect(structConstr.attemptPlacePart(part, structConstr.popOpenConnectionPoint(connectionNorthOfSecondPart))).to.be.true;

         structConstr.placedParts.forEach((p) => console.log(p.x + " " + p.y));
         structConstr.openConnectionPoints.forEach((p) => console.log("cp: " + p.x + " " + p.y + " " + p.template.connection_direction));

         expect(structConstr.placedParts).to.have.length(4);
         expect(structConstr.openConnectionPoints).to.have.length(8);
     });

     it("Should accurately revert structure placements", () =>{
         structConstr.setRoot(part, 10, 20);
         structConstr.attemptPlacePart(part, structConstr.popOpenConnectionPoint());
         structConstr.attemptPlacePart(part, structConstr.popOpenConnectionPoint());
         structConstr.attemptPlacePart(part, structConstr.popOpenConnectionPoint());
         structConstr.revertMoves(1);
         expect(structConstr.placedParts).to.have.length(3);
         structConstr.revertMoves(2);
         expect(structConstr.placedParts).to.have.length(1);
         expect(structConstr.openConnectionPoints).to.have.length(4);
     });

    it("Should accurately revert structures with multiple connections", () => {
        structConstr.setRoot(part, 10, 20);

        let connectionEastOfFirstPart = structConstr.openConnectionPoints.findIndex((pcp) => {
            return pcp.x == 10 && pcp.y == 20 && pcp.template.connection_direction == "east";
        });
        structConstr.attemptPlacePart(part, structConstr.popOpenConnectionPoint(connectionEastOfFirstPart));

        let connectionNorthOfFirstPart = structConstr.openConnectionPoints.findIndex((pcp) => {
            return pcp.x == 10 && pcp.y == 20 && pcp.template.connection_direction == "north";
        });
        structConstr.attemptPlacePart(part, structConstr.popOpenConnectionPoint(connectionNorthOfFirstPart));

        let connectionNorthOfSecondPart = structConstr.openConnectionPoints.findIndex((pcp) => {
            return pcp.x == 11 && pcp.y == 20 && pcp.template.connection_direction == "north";
        });
        structConstr.attemptPlacePart(part, structConstr.popOpenConnectionPoint(connectionNorthOfSecondPart));

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
});