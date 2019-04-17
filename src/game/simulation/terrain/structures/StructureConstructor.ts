import { Rectangle } from "../../../geom/Rectangle";
import { IStructure, IStructureConnection, IStructurePart } from "./IStructure";
import { TerrainMap } from "../../../../public/javascript/game/models/TerrainMap";
import { Point } from "../../../geom/Point";
import { TileDictionary } from "../tiles/TileDictionary";

export class StructureConstructor {
    existingPartsBounds: Rectangle[];

    openConnectionPoints: IStructureConnection[];

    struct: IStructure;
    map: TerrainMap;
    tiles: TileDictionary;

    constructor(struct: IStructure, map: TerrainMap, tiles: TileDictionary) {
        this.struct = struct;
        this.map = map;
        this.tiles = tiles;
    }

    public setRoot(part: IStructurePart, x: number, y: number) {
        this.accumulateOccupiedPoints(part, x, y).forEach((p: Point) => {

        });
    }

    public accumulateOccupiedPoints(part: IStructurePart, partX: number, partY: number): Point[] {
        let points: Point[] = [];
        for (let y = partY; y < part.height; y++) {
            for (let x = partX; x < part.width; x++) {
                if (part.structure[y][x] !== "") points.push(new Point(x, y));
            }
        }
        return points;
    }

    public getBlockIndexAt(x: number, y: number): number {
        return this.map.data[y][x]
    }
}