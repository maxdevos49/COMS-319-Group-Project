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

/**
 * The structure constructor is a helper object that allows a higher level generator to safely create structures. It
 * does none of the selecting of which parts to place nor terminating and reverting after to many failures. It simply
 * keeps track of what parts have been placed thus far and how many connection points need filled. It has methods that
 * a higher level object can call to attempt to place a given part which will fail if some predicate is not matched
 */
export class StructureConstructor {
    /**
     * The connection points that haven't been filled
     */
    openConnectionPoints: IPlacedStructurePartConnection[];
    /**
     * The parts that have been placed thus far by the structure constructor
     */
    placedParts: IPlacedStructurePart[];
    /**
     * The structure this constructor is making
     */
    struct: IStructure;
    /**
     * The terrain map this constructor is building on
     */
    map: TerrainMap;
    /**
     * The tiles that this structure constructor has available to it
     */
    tiles: TileDictionary;

    /**
     * Creates that new structure constructor to make the given structure
     * @param struct The structure for this constructor to make
     * @param map The map to make the structure on
     * @param tiles The tile dictionary containing all available tiles
     */
    constructor(struct: IStructure, map: TerrainMap, tiles: TileDictionary) {
        this.struct = struct;
        this.map = map;
        this.tiles = tiles;

        this.openConnectionPoints = [];
        this.placedParts = [];
    }

    /**
     * Commits the structures placed by this structure constructor to the terrain map
     */
    public commit(): void {
        this.placedParts.forEach((placed: IPlacedStructurePart) => {
            for (let y = placed.y; y < (placed.y + placed.template.height); y++) {
                for (let x = placed.x; x < (placed.x + placed.template.width); x++) {
                    if (placed.template.structure[y - placed.y][x - placed.x] !== "") {
                        let tile: ITile = this.tiles.tiles_name.get(placed.template.structure[y - placed.y][x - placed.x]);
                        this.map.setBlock(tile.layer, x, y, tile.id);
                    }
                }
            }
        });
    }

    /**
     * Checks if there are no required connection points left in the open connection point array
     * @return True if all of the required connections are filled, false otherwise
     */
    public isAllRequiredConnectionsFilled(): boolean {
        if (this.openConnectionPoints.length == 0) {
            return true;
        } else if (this.openConnectionPoints.length == 1) {
            return !this.openConnectionPoints[0].template.required;
        }

        return this.openConnectionPoints.map((cp) => !cp.template.required).reduce((accum, cur) => accum && cur);
    }

    /**
     * Pops an open connection point off of the array and returns it
     * @param at The optional index of the connection point to return
     * @return The last open connection point in the array or the one at the given index
     */
    public popOpenConnectionPoint(at?: number): IPlacedStructurePartConnection {
        if (at && at < this.openConnectionPoints.length - 1) {
            let temp = this.openConnectionPoints[at];
            this.openConnectionPoints[at] = this.openConnectionPoints.pop();
            return temp;
        } else {
            return this.openConnectionPoints.pop();
        }
    }

    /**
     * Sets the root of this structure constructor. The root is the only part that doesn't have to be placed on the
     * connection point of another (even if there are required on init connections) The only requirement is that
     * the map tiles you are placing this on are valid
     * @param part The part to set as the root
     * @param x The absolute x coordinate to place the top-left corner of the part
     * @param y The absolute y coordinate to place the top-left corner of the part
     * @return True if the root placement is successful, false otherwise
     */
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

    /**
     * Attempts to place the given part on the given connections, this will try to place every connection the given
     * parts has on the given connection
     * @param part The part to attempt to place
     * @param on The connection to attempt to place the part on
     * @return True if the part is placed, false otherwise
     */
    public attemptPlacePart(part: IStructurePart, on: IPlacedStructurePartConnection): boolean {
        // Iterate through every connection point of the part template
        for (let i = 0; i < part.connections.length; i++) {
            let connection = part.connections[i];

            let onOffset = getConnectionDirectionOffset(on.template.connection_direction);
            let absX = (on.x + onOffset.dx) - connection.x;
            let absY = (on.y + onOffset.dy) - connection.y;

            // Check if these two connections work
            if (!this.checkConnectionWorks(part, absX, absY, connection, on)) continue;
            // Create objects for the placed part but these might actually be valid
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

            // If this part has any connection that are required on initialization then check that those exist
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

            // If this part has also connected with any other parts check that those connections are also valid
            let existsAnyAlsoOccupied = false;
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
                        existsAnyAlsoOccupied = true;
                        allSatisfied = allSatisfied && temp;
                    });
            });

            if (existsAnyAlsoOccupied) {
                // If one of the additional connections was not satisfied then this part cannot be placed here
                if (!allSatisfied) {
                    continue;
                }
                // If they were all satisfied that bond the two connections together (which marks it for removal)
                placedConnections.forEach((partPCP) => {
                    let partPCPOffset = getConnectionDirectionOffset(partPCP.template.connection_direction);
                    this.openConnectionPoints.filter((openCP) => {
                        let openCPOffset = getConnectionDirectionOffset(openCP.template.connection_direction);
                        return (openCP.x + openCPOffset.dx == partPCP.x) && (openCP.y + openCPOffset.dy == partPCP.y) &&
                            (openCP.x == partPCP.x + partPCPOffset.dx) && (openCP.y == partPCP.y + partPCPOffset.dy);
                    }).forEach((openCP) => {
                        openCP.bondedWith = partPCP;
                        partPCP.bondedWith = openCP;
                    });
                });
            }
            placedPart.connections = placedConnections;

            // Find the placed connection point that was derived from the one used, mark it as such
            placedConnections.filter((cp) => cp.template == connection).forEach((cp) => {
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

    /**
     * Reverts the given number of moves from this structure constructor. This will not revert the root placement but
     * will revert all successful attemptPlacePart calls.
     * @param num The number of moves to revert
     */
    public revertMoves(num: number): void {
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
            this.revertMoves(num - 1);
        }
    }

    /**
     * Checks whether the given part can be placed at the given coordinate on the map without violating and requirements
     * from either the two parts in question or any other parts
     * @param part The part to check if it can be placed
     * @param absX The absolute x coordinate to check if top-left coordinate of the part can be placed at
     * @param absY The absolute y coordinate to check if top-left coordinate of the part can be placed at
     * @param connection The connection of the given part to attempt to connect
     * @param on The connection to attempt to connect the given part to
     * @return True if the structure can be placed using the given connections, false otherwise
     */
    public checkConnectionWorks(part: IStructurePart, absX: number, absY: number, connection: IStructureConnection, on: IPlacedStructurePartConnection): boolean {
        let onOffset = getConnectionDirectionOffset(on.template.connection_direction);
        let offset: {dx: number, dy: number} = getConnectionDirectionOffset(connection.connection_direction);

        // Check that the part fits within the map
        if (!(0 <= absX && absX + part.width < this.map.width && 0 <= absY && absY + part.height < this.map.height)) {
            return false;
        }

        // Check that the connection requirements for the existing connection are satisfied by the new part
        let existingConnectionSatisfied: boolean = this.tiles.checkTileIdentifiesAs(this.getStructureTileName(part, (on.x + onOffset.dx) - absX, (on.y + onOffset.dy) - absY), on.template.expects);
        let newConnectionSatisfied: boolean = this.tiles.checkTileIdentifiesAs(this.getStructureTileName(on.owner.template, (connection.x + offset.dx) + (absX - on.owner.x), (connection.y + offset.dy) + (absY - on.owner.y)), connection.expects);

        if (!(existingConnectionSatisfied && newConnectionSatisfied)) {
            return false;
        }
        // Check every point this structure part occupied
        for (let p of this.accumulateOccupiedPoints(part, absX, absY)) {
            // Check if the current block at each occupied point is one that this structure can overwrite
            let canOccupyPoint: boolean = this.tiles.checkTileIndexIdentifiesAs(this.getBlockIndexAt(p.x, p.y), this.struct.generatesOn);
            // If there are any points which this structure would need to occupy that are invalid, don't generate the structure
            if (!canOccupyPoint) {
                return false;
            }
        }

        return true;
    }

    /**
     * Accumulates the points the given structure occupies in absolute coordinates (relative to the top-left of the map)
     * @param part The part to accumulate to occupied points for
     * @param partX The absolute x coordinate of the top-left point of the structure
     * @param partY The absolute y coordinate of the top-left point of the structure
     * @return An array of points corresponding to every point the structure occupies
     */
    public accumulateOccupiedPoints(part: IStructurePart, partX: number, partY: number): Point[] {
        let points: Point[] = [];
        for (let y = 0; y < part.height; y++) {
            for (let x = 0; x < part.width; x++) {
                points.push(new Point(x + partX, y + partY));
            }
        }
        return points;
    }

    /**
     * Returns the block index at the given location including any structures that have been placed but not committed
     * @param x The x coordinate of the block to check in absolute coordinates (relative to the top-left of the map)
     * @param y The y coordinate of the block to check in absolute coordinates (relative to the top-left of the map)
     * @return The index of the tile at the given location
     */
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
     * @return The index of the tile at the given absolute coordinates or -1 if the given coordinate is not over the structure
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
     * @return The name of the tile located at the given relative coordinate from the structure
     */
    public getStructureTileName(part: IStructurePart, x: number, y: number) {
        // Check that the coordinate exists in the structure
        if (0 <= x && x < part.width && 0 <= y && y < part.height) {
            return part.structure[y][x];
        }
        return "";
    }
}