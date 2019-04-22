import {
    getConnectionDirectionOffset,
    IPlacedStructurePart,
    IPlacedStructurePartConnection,
    IStructure,
    IStructureConnection,
    IStructurePart
} from "./IStructure";
import { TerrainMap } from "../../../../public/javascript/game/models/TerrainMap";
import { Point } from "../../../geom/Point";
import { TileDictionary } from "../tiles/TileDictionary";
import { ITile } from "../tiles/ITile";

export class StructureConstructor {
    openConnectionPoints: IPlacedStructurePartConnection[];

    placedParts: IPlacedStructurePart[];

    struct: IStructure;
    map: TerrainMap;
    tiles: TileDictionary;

    constructor(struct: IStructure, map: TerrainMap, tiles: TileDictionary) {
        this.struct = struct;
        this.map = map;
        this.tiles = tiles;

        this.openConnectionPoints = [];
        this.placedParts = [];
    }

    public commit(): void {
        this.placedParts.forEach((placed: IPlacedStructurePart) => {
            for (let y = placed.y; y < (placed.y + placed.template.height); y++) {
                for (let x = placed.x; x < (placed.x + placed.template.width); x++) {
                    if (placed.template.structure[y - placed.y][x - placed.x] !== "") {
                        console.log(placed.template.structure[y - placed.y][x - placed.x]);
                        let tile: ITile = this.tiles.tiles_name.get(placed.template.structure[y - placed.y][x - placed.x]);
                        this.map.setBlock(tile.layer, x, y, tile.id);
                    }
                }
            }
        });
    }

    public isAllRequiredConnectionsFilled(): boolean {
        if (this.openConnectionPoints.length == 0) {
            return true;
        } else if (this.openConnectionPoints.length == 1) {
            return !this.openConnectionPoints[0].template.required;
        }

        return this.openConnectionPoints.map((cp) => !cp.template.required).reduce((accum, cur) => accum && cur);
    }

    public popOpenConnectionPoint(at?: number, preferRequired? : boolean): IPlacedStructurePartConnection {
        if (preferRequired) {
            let required: IPlacedStructurePartConnection[] = this.openConnectionPoints.filter((cp) => cp.template.required);

            if (required.length > 0) {
                let adjustedAt = at % required.length;
                let selected: IPlacedStructurePartConnection = required[adjustedAt];

                this.openConnectionPoints = this.openConnectionPoints.filter((cp) => cp != selected);
                return selected;
            } else {
                return this.popOpenConnectionPoint(at, false);
            }
        }

        if (at && at < this.openConnectionPoints.length - 1) {
            let temp = this.openConnectionPoints[at];
            this.openConnectionPoints[at] = this.openConnectionPoints.pop();
            return temp;
        } else {
            return this.openConnectionPoints.pop();
        }
    }

    public setRoot(part: IStructurePart, x: number, y: number): boolean {
        // Check every point this structure part occupies
        // Check every point this structure part occupies
        for (let p of this.accumulateOccupiedPoints(part, x, y)) {
            // Check if the current block at each occupied point is one that this structure can overwrite
            let canOccupyPoint: boolean = this.tiles.checkTileIndexIdentifiesAs(this.getBlockIndexAt(p.x, p.y), this.struct.generatesOn);
            // If there are any points which this structure would need to occupy that are invalid, don't generate the structure
            if (!canOccupyPoint) return false;
        }

        let placedPart: IPlacedStructurePart = {
            x: x,
            y: y,
            template: part,
            connections: null
        };

        let placedConnections: IPlacedStructurePartConnection[] = part.connections.map((connection) => {
            return {
                x: x + connection.x,
                y: y + connection.y,
                owner: placedPart,
                template: connection,
                bondedWith: null
            };
        });
        placedPart.connections = placedConnections;

        // Add the part to the placed parts
        this.placedParts.push(placedPart);
        // Add the connections of the part to the open connections
        placedConnections.forEach((cp) => this.openConnectionPoints.push(cp));

        return true;
    }

    public attemptPlacePart(part: IStructurePart, on: IPlacedStructurePartConnection): boolean {
        // Iterate through every connection point of the part template
        for (let i = 0; i < part.connections.length; i++) {
            let connection = part.connections[i];

            let onOffset = getConnectionDirectionOffset(on.template.connection_direction);
            let absX = (on.x + onOffset.dx) - connection.x;
            let absY = (on.y + onOffset.dy) - connection.y;

            if (!this.checkConnectionWorks(part, absX, absY, connection, on)) continue;

            let placedPart: IPlacedStructurePart = {
                x: absX,
                y: absY,
                template: part,
                connections: null
            };

            let placedConnections: IPlacedStructurePartConnection[] = part.connections.map((cp) => {
                return {
                    x: absX + cp.x,
                    y: absY + cp.y,
                    owner: placedPart,
                    template: cp,
                    bondedWith: null,
                };
            });

            let allRequiredOnInitSatisfied = true;
            placedConnections.forEach((partPCP) => {
                if (partPCP.template.requiredOnInit) {
                    let offset = getConnectionDirectionOffset(partPCP.template.connection_direction);
                    let satisfied: boolean = this.tiles.checkTileIndexIdentifiesAs(this.getBlockIndexAt(partPCP.x + offset.dx, partPCP.y + offset.dy), partPCP.template.expects);
                    if (!satisfied) allRequiredOnInitSatisfied = false;
                }
            });
            if (!allRequiredOnInitSatisfied) {
                continue;
            }

            let existsAnyAlsoOccpied = false;
            let allSatisfied = true;
            placedConnections.forEach((partPCP) => {
                let partPCPOffset = getConnectionDirectionOffset(partPCP.template.connection_direction);
                this.openConnectionPoints
                    .filter((openCP) => {
                        let openCPOffset = getConnectionDirectionOffset(openCP.template.connection_direction);
                        return (openCP.x + openCPOffset.dx == partPCP.x) && (openCP.y + openCPOffset.dy == partPCP.y) &&
                            (openCP.x == partPCP.x + partPCPOffset.dx) && (openCP.y == partPCP.y + partPCPOffset.dy);
                    })
                    .map((openCP) => {
                        return this.checkConnectionWorks(part, absX, absY, partPCP.template, openCP);
                    })
                    .forEach((temp) => {
                        existsAnyAlsoOccpied = true;
                        allSatisfied = allSatisfied && temp;
                    });
            });

            if (existsAnyAlsoOccpied) {
                if (!allSatisfied) {
                    continue;
                }

                placedConnections.forEach((partPCP) => {
                    let partPCPOffset = getConnectionDirectionOffset(partPCP.template.connection_direction);
                    this.openConnectionPoints.filter((openCP) => {
                        let openCPOffset = getConnectionDirectionOffset(openCP.template.connection_direction);
                        return (openCP.x + openCPOffset.dx == partPCP.x) && (openCP.y + openCPOffset.dy == partPCP.y) &&
                            (openCP.x == partPCP.x + partPCPOffset.dx) && (openCP.y == partPCP.y + partPCPOffset.dy);
                    }).forEach((openCP) => {
                        //console.log(openCP.x + " " + openCP.y + " " + openCP.template.connection_direction + " " + partPCP.x + " " + partPCP.y + " " + partPCP.template.connection_direction);
                        openCP.bondedWith = partPCP;
                        partPCP.bondedWith = openCP;
                    });
                });
            }

            placedPart.connections = placedConnections;

            placedConnections.filter((cp) => cp.template == connection).forEach((cp) => {
                //console.log("WOW!!! " + cp.x + " " + cp.y + " " + cp.template.connection_direction);
                //console.log("WOW 22!!! " + on.x + " " + on.y + " " + on.template.connection_direction);
                on.bondedWith = cp;
                cp.bondedWith = on;
            });

            // Add the part to the placed parts
            this.placedParts.push(placedPart);
            // Add the connections of the part to the open connections
            placedConnections.forEach((cp) => this.openConnectionPoints.push(cp));
            this.openConnectionPoints = this.openConnectionPoints.filter((cp) => !cp.bondedWith);

            part.rarity -= part.rarity_usage_decrease;
            return true;
        }
        return false;
    }

    public revertMoves(num: number) {
        if (num > 0) {
            let toRevert: IPlacedStructurePart = this.placedParts.pop();

            toRevert.template.rarity += toRevert.template.rarity_usage_decrease;

            toRevert.connections.forEach((cp) => {
               if (cp.bondedWith) {
                   cp.bondedWith.bondedWith = null;
                   this.openConnectionPoints.push(cp.bondedWith);
                   cp.bondedWith = null;
               }
            });
            // Remove any connection points this structure owned
            this.openConnectionPoints = this.openConnectionPoints.filter((cp) => cp.owner != toRevert);
            //console.log(toRevert + " " + this.usedConnectionPoints.get(toRevert));
            this.revertMoves(num - 1);
        }
    }

    public checkConnectionWorks(part: IStructurePart, absX: number, absY: number, connection: IStructureConnection, on: IPlacedStructurePartConnection): boolean {
        let onOffset = getConnectionDirectionOffset(on.template.connection_direction);
        let offset: {dx: number, dy: number} = getConnectionDirectionOffset(connection.connection_direction);

        // Check that the part fits within the map
        if (!(0 <= absX && absX + part.width < this.map.width && 0 <= absY && absY + part.height < this.map.height)) {
            //console.log("failed here" + absX + " " + absY);
            return false;
        }

        // Check that the connection requirements for the existing connection are satisfied by the new part
        let existingConnectionSatisfied: boolean = this.tiles.checkTileIdentifiesAs(this.getStructureTileName(part, (on.x + onOffset.dx) - absX, (on.y + onOffset.dy) - absY), on.template.expects);
        let newConnectionSatisfied: boolean = this.tiles.checkTileIdentifiesAs(this.getStructureTileName(on.owner.template, (connection.x + offset.dx) + (absX - on.owner.x), (connection.y + offset.dy) + (absY - on.owner.y)), connection.expects);
        //console.log(this.getStructureTileName(part, (on.x + onOffset.dx) - absX, (on.y + onOffset.dy) - absY) + " " + this.getStructureTileName(on.owner.template, (connection.x + offset.dx) + (absX - on.owner.x), (connection.y + offset.dy) + (absY - on.owner.y)));
        if (!(existingConnectionSatisfied && newConnectionSatisfied)) {
            //console.log("failed at requirment: " + existingConnectionSatisfied + " " + newConnectionSatisfied + " " + absX + " " + absY);
            return false;
        }
        // Check every point this structure part occupied
        for (let p of this.accumulateOccupiedPoints(part, absX, absY)) {
            //console.log(p.x + " " + p.y);
            // Check if the current block at each occupied point is one that this structure can overwrite
            let canOccupyPoint: boolean = this.tiles.checkTileIndexIdentifiesAs(this.getBlockIndexAt(p.x, p.y), this.struct.generatesOn);
            // If there are any points which this structure would need to occupy that are invalid, don't generate the structure
            if (!canOccupyPoint) {
                return false;
            }
        }

        return true;
    }

    public accumulateOccupiedPoints(part: IStructurePart, partX: number, partY: number): Point[] {
        let points: Point[] = [];
        for (let y = 0; y < part.height; y++) {
            for (let x = 0; x < part.width; x++) {
                points.push(new Point(x + partX, y + partY));
            }
        }
        return points;
    }

    public getBlockIndexAt(x: number, y: number): number {
        // Make sure the coordinate is in range of the map
        if (0 <= x && x < this.map.width && 0 <= y && y < this.map.height) {
            // First check if one of the placed structures occupies this coordinate
            for (let placed of this.placedParts) {
                let placedBlock: number = this.getPlacedStructureBlockIndexAt(placed, x, y);
                if (placedBlock !== -1) return placedBlock;
            }
            return this.map.getHighestTile(x, y);
        }
        return -1;
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
                return this.tiles.tiles_name.get(placed.template.structure[dy][dx]).id;
            } else {
                return -1;
            }
        }
        return -1;
    }

    /**
     * Gets the tile name of the tile at the given coordinate in the structure or empty string if no tile exists
     * @param part The part to get the tile name of
     * @param x The x coordinate of the tile to check relative to the structure part
     * @param y The y coordinate of the tile to check relative to the structure part
     */
    public getStructureTileName(part: IStructurePart, x: number, y: number) {
        // Check that the coordinate exists in the structure
        if (0 <= x && x < part.width && 0 <= y && y < part.height) {
            return part.structure[y][x];
        }
        return "";
    }
}