import { TerrainMap } from "../../../public/javascript/game/models/TerrainMap";
import { GameSimulation } from "../GameSimulation";
import * as fs from "fs";
import { ITile, ITileOption } from "./tiles/ITile";
import * as path from "path";
import { IRegion } from "./IRegion";
import { NoiseMap } from "./NoiseMap";
import {
    IPlacedStructurePartConnection,
    IStructure,
    IStructureConnection,
    IStructurePart
} from "./structures/IStructure";
import { TileDictionary } from "./tiles/TileDictionary";
import { StructureConstructor } from "./structures/StructureConstructor";

export class TerrainGenerator {
    private static chunkSize: number = 64;
    private static partAttemptPlaceLimit: number = 50;

    public static generateTerrain(simulation: GameSimulation, map: TerrainMap) {
        let tiles:TileDictionary = this.loadAllTiles();
        let regions: IRegion[] = this.loadAllRegions();
        let structures: IStructure[] = this.loadAllStructures();

        let temperatureMap: NoiseMap = new NoiseMap(map.width, map.height, this.chunkSize);
        let humidityMap: NoiseMap = new NoiseMap(map.width, map.height, this.chunkSize);

        // Loop through every tile and assign it a random tile based on the region that best fits
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                let region: IRegion = this.findBestFitRegion(temperatureMap.map[y][x], humidityMap.map[y][x], regions);
                map.data[y][x] = tiles.tiles_name.get(this.randomTile(region.tiles).name).index;
            }
        }

        while (true) {
            let attemptLimit: number = 1200;
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
                    console.log("hello");
                    // Loop until all of the connection points have been filled
                    let structureCompleted = false;
                    while (true) {
                        let requiredFilled: boolean = constructionManager.isAllRequiredConnectionsFilled();
                        let cp: IPlacedStructurePartConnection = constructionManager.popOpenConnectionPoint(Math.floor(Math.random() * constructionManager.openConnectionPoints.length), false);
                        if (!cp || requiredFilled) {
                            if (constructionManager.placedParts.length < toAttempt.minParts) {
                                if (constructionManager.placedParts.length <= 1) break;
                                constructionManager.revertMoves(4);
                                attemptLimit--;
                                if (attemptLimit < 0) {
                                    break;
                                }
                                continue;
                            } else {
                                structureCompleted = true;
                                break;
                            }
                        }
                        let connectionPointFilled = false;
                        let alreadyAttempted: IStructurePart[] = [];
                        for (let limit = this.partAttemptPlaceLimit; limit > 0; limit--) {
                            //console.log("attempt " + limit);
                            let partToAttempt: IStructurePart = this.randomStructurePart(parts, alreadyAttempted);
                            if (!partToAttempt) break;
                            //console.log("Attempting: " + partToAttempt.name);
                            alreadyAttempted.push(partToAttempt);
                            if (constructionManager.attemptPlacePart(partToAttempt, cp)) {
                                //console.log(partToAttempt.name);
                                connectionPointFilled = true;
                                //console.log(constructionManager.placedParts.length + " " + constructionManager.openConnectionPoints.length + " Placed " + partToAttempt.name + " " + partToAttempt.rarity);
                                break;
                            } else {
                                //console.log("Failed");
                            }
                        }
                        //console.log(connectionPointFilled + " " + attemptLimit);
                        // If after the limit number of attempts the point is not filled then revert the last five moves
                        // If this will totally delete all placed parts then cancel this generation
                        if (!connectionPointFilled || constructionManager.placedParts.length > toAttempt.maxParts) {
                            constructionManager.openConnectionPoints.push(cp);
                            if (cp.template.required) {
                                //console.log("reverting");
                                if (constructionManager.placedParts.length - 5 <= 0) break;
                                constructionManager.revertMoves(5);
                            }
                            //console.log("reverting 5 moves");
                            attemptLimit--;
                            if (attemptLimit < 0) {
                                //console.log("test");
                                //structureCompleted = true;
                                break;
                            }
                        }
                    }
                    //console.log(structureCompleted + " " + constructionManager.openConnectionPoints.length + " " + constructionManager.placedParts.length);
                    if (structureCompleted && constructionManager.placedParts.length > toAttempt.minParts) {
                        console.log(structCenterX + " " + structCenterY + " " + constructionManager.placedParts.length);
                        constructionManager.commit();
                        break;
                    }
                }
            }
        }
    }

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

    public static randomTile(options: ITileOption[]) {
        while (true) {
            let selected: ITileOption = options[Math.floor(Math.random() * options.length)];
            if ((Math.random() * 100) < selected.rarity) return selected;
        }
    }

    public static findBestFitRegion(temp: number, humidity: number, regions: IRegion[]) {
        let curBest: IRegion;
        let curBestDistance: number = Number.MAX_VALUE;

        regions.forEach((region) => {
            let distTemp = region.temperature - temp;
            let distHumidity = region.humidity - humidity;
            let distance =  (distTemp * distTemp) + (distHumidity * distHumidity);
            if (curBestDistance > distance) {
               curBest = region;
               curBestDistance = distance;
           }
        });

        return curBest;
    }

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

    public static loadAllRegions(): IRegion[] {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "regions.json"), "utf8")) as IRegion[];
    }

    public static loadAllStructures(): IStructure[] {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "structures", "structures.json"), "utf8")) as IStructure[];
    }

    public static loadAllStructureParts(struct: IStructure): IStructurePart[] {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "structures", struct.path), "utf8")) as IStructurePart[];
    }
}
