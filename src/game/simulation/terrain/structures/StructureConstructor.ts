import { Rectangle } from "../../../geom/Rectangle";
import { IPlacedStructurePart, IStructure, IStructureConnection, IStructurePart } from "./IStructure";
import { TerrainMap } from "../../../../public/javascript/game/models/TerrainMap";
import { Point } from "../../../geom/Point";
import { TileDictionary } from "../tiles/TileDictionary";

export class StructureConstructor {
    existingPartsBounds: Rectangle[];

    openConnectionPoints: IStructureConnection[];

    placedParts: IPlacedStructurePart[];

    struct: IStructure;
    map: TerrainMap;
    tiles: TileDictionary;

    constructor(struct: IStructure, map: TerrainMap, tiles: TileDictionary) {
        this.struct = struct;
        this.map = map;
        this.tiles = tiles;

        this.openConnectionPoints = [];
        this.existingPartsBounds = [];
        this.placedParts = [];
    }

    public popOpenConnectionPoint(): IStructureConnection {
        return this.openConnectionPoints.pop();
    }

    public setRoot(part: IStructurePart, x: number, y: number): boolean {
        // Check every point this structure part occupies
        for (let p of this.accumulateOccupiedPoints(part, x, y)) {
            // Check if the current block at each occupied point is one that this structure can overwrite
            let canOccupyPoint: boolean = false;
            this.struct.generatesOn.forEach((canOverwriteName: string) => {
               if (this.tiles.checkTileIndexIdentifiesAs(this.getBlockIndexAt(p.x, p.y), canOverwriteName)) canOccupyPoint = true;
            });
            // If there are any points which this structure would need to occupy that are invalid, don't generate the structure
            if (!canOccupyPoint) return false;
        }

        // Add all of the connection points (These have absolute coordinates rather than relative
        let connectionPoints: IStructureConnection[] = this.accumulateConnectionPoints(part, x, y)
        connectionPoints.forEach((cp) => this.openConnectionPoints.push(cp));
        // Add the part to the placed parts
        this.placedParts.push({
            x: x,
            y: y,
            absConnections: connectionPoints,
            template: part
        });

        return true;
    }

    public attemptPlacePart(part: IStructurePart, on: IStructureConnection): boolean {
        // Iterate through every connection point of the part template
        for (let connection of part.connections) {
            // Calculate the xy coordinates of the part if the current connection point is placed on the given one
            let absX = on.x - connection.x;
            let absY = on.y - connection.y;
            // Check every point this structure part occupied
            let connectionValid = true;
            for (let p of this.accumulateOccupiedPoints(part, absX, absY)) {
                // Check if the current block at each occupied point is one that this structure can overwrite
                let canOccupyPoint: boolean = false;
                this.struct.generatesOn.forEach((canOverwriteName: string) => {
                    if (this.tiles.checkTileIndexIdentifiesAs(this.getBlockIndexAt(p.x, p.y), canOverwriteName)) canOccupyPoint = true;
                });
                // If there are any points which this structure would need to occupy that are invalid, don't generate the structure
                if (!canOccupyPoint) connectionValid = false;
            }
            if (!connectionValid) continue;

            // Add all of the connection points (except the one used) (These have absolute coordinates rather than relative
            let connectionPoints: IStructureConnection[] = this.accumulateConnectionPoints(part, absX, absY);
            connectionPoints.filter((cp) => cp != connection).forEach((cp) => this.openConnectionPoints.push(cp));
            // Add the part to the placed parts
            this.placedParts.push({
                x: absX,
                y: absY,
                absConnections: connectionPoints,
                template: part
            });
        }
        return false;
    }

    public accumulateConnectionPoints(part: IStructurePart, partX: number, partY: number): IStructureConnection[] {
        let connectionPoints: IStructureConnection[] = [];
        part.connections.forEach((template: IStructureConnection) => {
            connectionPoints.push({
                expects: template.expects,
                x: template.x + partX,
                y: template.y + partY,
                required: template.required
            });
        })
        return connectionPoints;
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
        // First check if one of the placed structures occupies this coordinate
        for (let placed of this.placedParts) {
            let placedBlock: number = this.getPlacedStructureBlockIndexAt(placed, x, y);
            if (placedBlock !== -1) return placedBlock;
        }
        return this.map.data[y][x]
    }

    /**
     * Gets the index of the block in the placed structure at the given absolute coordinates. Returns -1 if the
     * structure doesn't have a block at the given index
     * @param placed The placed structure part
     * @param x The absolute x coordinate (relative to the top left corner of the map)
     * @param y The absolute y coordinate (relative to the top left corner of the map)
     */
    public getPlacedStructureBlockIndexAt(placed: IPlacedStructurePart, x: number, y: number): number {
        let dx = x - placed.x;
        let dy = y - placed.y;
        if (0 <= dx && dx < placed.template.width && 0 <= dy && dy < placed.template.height) {
            if (placed.template.structure[dy][dx] !== "") {
                return this.tiles.tiles_name.get(placed.template.structure[dy][dx]).index;
            } else {
                return -1;
            }
        }
        return -1;
    }
}