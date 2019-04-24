import { TerrainMap } from "../../../public/javascript/game/models/TerrainMap";
import { GameSimulation } from "../GameSimulation";
import * as fs from "fs";
import { ITile, ITileLayer, ITileOption } from "./tiles/ITile";
import * as path from "path";
import { IRegion } from "./IRegion";
import { NoiseMap } from "./NoiseMap";
import {
    IPlacedStructurePartConnection,
    IStructure,
    IStructurePart
} from "./structures/IStructure";
import { TileDictionary } from "./tiles/TileDictionary";
import { StructureConstructor } from "./structures/StructureConstructor";

export class TerrainGenerator {
    /**
     * The size of the chunks for the perlin noise generator (bigger chunks = bigger regions)
     */
    private static chunkSize: number = 200;
    /**
     * The max number of times to attempt to place a part on a connection point
     */
    private static partAttemptPlaceLimit: number = 50;

    /**
     * Generates a new terrain map with a randomized terrain.
     * @param simulation The simulation to generate the new random world in
     * @param width The width of the map to generate
     * @param height The height of the map to generate
     */
    public static generateTerrain(simulation: GameSimulation, width: number, height: number): TerrainMap {
        let layers: ITileLayer[] = this.loadAllLayers();
        let tiles:TileDictionary = this.loadAllTiles();
        let regions: IRegion[] = this.loadAllRegions();
        let structures: IStructure[] = this.loadAllStructures();

        let map = new TerrainMap(width, height, 32, 32, layers, tiles.tiles);

        console.log("Randomizing regions and placing tiles");
        let temperatureMap: NoiseMap = new NoiseMap(map.width, map.height, this.chunkSize);
        let humidityMap: NoiseMap = new NoiseMap(map.width, map.height, this.chunkSize);

        // Loop through every tile and assign it a random tile based on the region that best fits
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                let region: IRegion = this.findBestFitRegion(temperatureMap.map[y][x], humidityMap.map[y][x], regions);
                let bestFitTile: ITile = tiles.tiles_name.get(this.randomTile(region.tiles).name);
                map.setBlock(bestFitTile.layer, x, y, bestFitTile.id);
            }
        }

        console.log("Placing Structures on the map");
        let successfulPlaceAttempts = 0;
        for (let structurePlaceAttempts = 0; structurePlaceAttempts < 1500; structurePlaceAttempts++) {
            let attemptLimit: number = 2000;
            // Select a random structure
            let toAttempt: IStructure = structures[Math.floor(Math.random() * structures.length)];
            let parts: IStructurePart[] = this.loadAllStructureParts(toAttempt);
            // Do a rarity check
            if (toAttempt.rarity > (Math.random() * 100)) {
                // Select a random place on the map to attempt to place the structure
                let structCenterX = Math.floor(Math.random() * map.width);
                let structCenterY = Math.floor(Math.random() * map.height);
                // Select a random part and attempt to place it as the root
                let constructionManager: StructureConstructor = new StructureConstructor(toAttempt, map, tiles);
                if (constructionManager.setRoot(this.randomStructurePart(parts, []), structCenterX, structCenterY)) {
                    // Loop until all of the connection points have been filled
                    let structureCompleted = false;
                    while (true) {
                        // Check if there are no more required connections left to fill
                        let requiredFilled: boolean = constructionManager.isAllRequiredConnectionsFilled();
                        if (requiredFilled) {
                            // If this part doesn't meet the minimum required number of parts then revert a few moves
                            if (constructionManager.placedParts.length < toAttempt.minParts) {
                                if (constructionManager.placedParts.length <= 4) break;
                                constructionManager.revertMoves(4);
                                // If we have exceeded the allowed number of attempts then stop
                                attemptLimit--;
                                if (attemptLimit < 0) {
                                    break;
                                }
                            } else {
                                // The structure is considered finished
                                structureCompleted = true;
                                break;
                            }
                        }
                        let cp: IPlacedStructurePartConnection = constructionManager.popOpenConnectionPoint(Math.floor(Math.random() * constructionManager.openConnectionPoints.length));
                        // Whether the connection point was filled
                        let connectionPointFilled = false;
                        // The structure parts that were already attempted to be placed at the given location
                        let alreadyAttempted: IStructurePart[] = [];
                        // Attempt to place a part at the connection point a certain number of times
                        for (let limit = this.partAttemptPlaceLimit; limit > 0; limit--) {
                            let partToAttempt: IStructurePart = this.randomStructurePart(parts, alreadyAttempted);
                            // If there are no parts left to be tried then stop
                            if (!partToAttempt) break;
                            alreadyAttempted.push(partToAttempt);
                            // If the part is placed
                            if (constructionManager.attemptPlacePart(partToAttempt, cp)) {
                                connectionPointFilled = true;
                                break;
                            }
                        }
                        // If after the limit number of attempts the point is not filled then revert the last five moves
                        // If this will totally delete all placed parts then stop this generation attempt
                        if (!connectionPointFilled || constructionManager.placedParts.length > toAttempt.maxParts) {
                            // The connection point was not filled so re-add it to the array of points waiting to be filled
                            constructionManager.openConnectionPoints.push(cp);
                            // Only perform the revert if the part that failed was a required part (optimization)
                            if (cp.template.required) {
                                if (constructionManager.placedParts.length - 5 <= 0) break;
                                constructionManager.revertMoves(5);
                            }
                            // If we have exceeded the attempt limit then stop
                            attemptLimit--;
                            if (attemptLimit < 0) {
                                break;
                            }
                        }
                    }
                    // If all required connections have been filled and the generated structure meets the minimum number of required parts then commit the structure
                    if (structureCompleted && constructionManager.placedParts.length >= toAttempt.minParts) {
                        constructionManager.commit();
                        successfulPlaceAttempts++;
                    }
                }
            }
        }

        console.log("Placed " + successfulPlaceAttempts + " structures on the map");
        return map;
    }

    /**
     * Returns a random structure part excluding the ones that are in the already attempted array. This method considers
     * the rarity of each part and returns parts proportional to this.
     * @param options The parts that this method can return
     * @param alreadyAttempted The parts that this method shouldn't return
     */
    public static randomStructurePart(options: IStructurePart[], alreadyAttempted: IStructurePart[]) {
        let possibleOptions: IStructurePart[] = options.filter((part) => part.rarity > 0 && !alreadyAttempted.includes(part));

        // Special case where options only includes one element that hasn't been already tried
        if (possibleOptions.length == 1) {
            return possibleOptions[0];
        } else if (possibleOptions.length == 0) {
            return undefined;
        }

        let totalRarity: number = possibleOptions.map((part) => part.rarity)
            .reduce((accum, cur) => accum + cur);

        let selectedRarity = Math.floor(Math.random() * totalRarity);
        for (let i = 0; i < possibleOptions.length; i++) {
            if (possibleOptions[i].rarity > 0) {
                selectedRarity -= possibleOptions[i].rarity;
                if (selectedRarity <= 0) return possibleOptions[i];
            }
        }
        // Should never happen
        return null;
    }

    /**
     * Returns a random tile from the given options. This method considers the rarity of each tile and randomly returns
     * tiles proportional to this value
     * @param options The tiles that this function can return
     */
    public static randomTile(options: ITileOption[]) {
        while (true) {
            let selected: ITileOption = options[Math.floor(Math.random() * options.length)];
            if ((Math.random() * 100) < selected.rarity) return selected;
        }
    }

    /**
     * Finds the region that best fits the given climate
     * @param temp The temperature of the region from 0 to 100
     * @param humidity The humidity of the region from 0 to 100
     * @param regions The regions to consider
     */
    public static findBestFitRegion(temp: number, humidity: number, regions: IRegion[]) {
        let curBest: IRegion;
        let curBestDistance: number = Number.MAX_VALUE;

        regions.forEach((region) => {
            let distTemp = region.temperature - temp;
            let distHumidity = region.humidity - humidity;
            let distance =  (Math.min(distTemp, distHumidity) * Math.min(distTemp, distHumidity)) + (Math.max(distTemp, distHumidity));
            if (curBestDistance > distance) {
               curBest = region;
               curBestDistance = distance;
           }
        });

        return curBest;
    }

    /**
     * Loads the layers file from the disk and returns the data in it
     */
    public static loadAllLayers(): ITileLayer[] {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "tiles", "layers.json"), "utf8")) as ITileLayer[];
    }

    /**
     * Loads the tiles json file from the disk and then uses the paths given in it to load all of the available tiles as
     * a tile dictionary
     */
    public static loadAllTiles(): TileDictionary {
        // Load atlas with paths to other tiles
        let tilesAtlas = JSON.parse(fs.readFileSync(path.join(__dirname, "tiles", "tiles.json"), "utf8")) as {tile_files: string[]};

        let tiles: ITile[] = [];
        tilesAtlas.tile_files.forEach((file) => {
           let tilesFromFile: ITile[] = JSON.parse(fs.readFileSync(path.join(__dirname, "tiles", file), "utf8")) as ITile[];
           tilesFromFile.forEach((tile) => tiles.push(tile));
        });

        return new TileDictionary(tiles);
    }

    /**
     * Loads the regions json file from the disk and returns its data
     */
    public static loadAllRegions(): IRegion[] {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "regions.json"), "utf8")) as IRegion[];
    }

    /**
     * Loads the structures file from the disk and returns its data
     */
    public static loadAllStructures(): IStructure[] {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "structures", "structures.json"), "utf8")) as IStructure[];
    }

    /**
     * Loads the structure parts json file that belongs to the given structures and returns its data
     * @param struct The structure to load the parts for
     */
    public static loadAllStructureParts(struct: IStructure): IStructurePart[] {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "structures", struct.path), "utf8")) as IStructurePart[];
    }
}
