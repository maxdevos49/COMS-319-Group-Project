import { TerrainMap } from "../../../public/javascript/game/models/TerrainMap";
import { GameSimulation } from "../GameSimulation";
import * as fs from "fs";
import { ITile} from "./tiles/ITile";
import * as path from "path";
import { IRegion } from "./IRegion";
import { NoiseMap } from "./NoiseMap";
import {
    IStructure} from "./structures/IStructure";
import { TileDictionary } from "./tiles/TileDictionary";
import { StructureConstructor } from "./structures/StructureConstructor";
import { b2Body, b2BodyDef, b2BodyType } from "../../../../lib/box2d-physics-engine/Dynamics/b2Body";
import { b2FixtureDef } from "../../../../lib/box2d-physics-engine/Dynamics/b2Fixture";
import { b2CircleShape } from "../../../../lib/box2d-physics-engine/Collision/Shapes/b2CircleShape";
import { worldAndHitboxCollisionFilter, worldCollisionFilter } from "../CollisionFilters";
import { b2PolygonShape } from "../../../../lib/box2d-physics-engine/Collision/Shapes/b2PolygonShape";
import { ITileOption } from "./tiles/ITileOption";
import { ITileLayer } from "./tiles/ITileLayer";
import { IStructurePart } from "./structures/IStructurePart";
import { IPlacedStructurePartConnection } from "./structures/IPlaceedStructurePartConnection";
import { IItemConfig } from "../items/configs/IItemConfig";
import { ItemObject } from "../objects/ItemObject";
import { InventoryItemFactory } from "../items/InventoryItemFactory";

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
     * The number of items to attempt to place
     */
    private static itemsPlaceAttempts: number = 1000;
    /**
     * The number of times to attempt to place an item once it's been randomly selected
     */
    private static itemPlaceAttemptLimit: number = 100;
    private static itemPlaceCheckRadius: number = 5;
    /**
     * The size of the border of water that will be placed on the edges of the map
     */
    private static borderSize: number = 25;
    /**
     * The size of the sand gradient that will exist between the water border and normal terrain
     */
    private static borderSandGradientSize: number = 5;
    /**
     * Generates a new terrain map with a randomized terrain.
     * @param simulation The simulation to generate the new random world in
     * @param width The width of the map to generate
     * @param height The height of the map to generate
     * @return The terrain map that was generated
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

        let waterTile: ITile = tiles.tiles_name.get("water");
        let sandRegion: IRegion = regions.find((reg) => reg.name == "sand");
        // Loop through every tile and assign it a random tile based on the region that best fits
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                // If we are within the range which water for the border should be placed then place it
                if (x < this.borderSize || y < this.borderSize || ((width - x) < this.borderSize) || (height - y)  < this.borderSize) {
                    map.setBlock(waterTile.layer, x, y, waterTile.id);
                } else  {
                    let distanceFromBorder: number = Math.min(
                        Math.abs(x - this.borderSize),
                        Math.abs((y - this.borderSize)),
                        Math.abs(width - this.borderSize - x),
                        Math.abs(height - this.borderSize - y)
                    );
                    let region: IRegion = this.findBestFitRegion(temperatureMap.map[y][x], humidityMap.map[y][x], regions);
                    if (region.name != "water" && distanceFromBorder < this.borderSandGradientSize && (Math.pow(this.borderSandGradientSize - distanceFromBorder, 2)) / Math.pow(this.borderSandGradientSize, 2) > Math.random()) {
                        let tileToPlace: ITile = tiles.tiles_name.get(this.randomTile(sandRegion.tiles).name);
                        map.setBlock(tileToPlace.layer, x, y, tileToPlace.id);
                    } else {
                        let bestFitTile: ITile = tiles.tiles_name.get(this.randomTile(region.tiles).name);
                        map.setBlock(bestFitTile.layer, x, y, bestFitTile.id);
                    }
                }
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

        console.log("Adding collision fixtures for the terrain");
        let tileHitboxShape = new b2PolygonShape().SetAsBox((32 / 100) / 2, (32 / 100) / 2);
        for (let x = 0; x < map.width; x++) {
            for (let y = 0; y < map.height; y++) {
                if (x < this.borderSize - 1 || y < this.borderSize  - 1 || ((width - x) < this.borderSize - 1) || (height - y)  < this.borderSize - 1) {
                    continue;
                }

                for (let layer of map.layers) {
                    if (layer.collides && layer.getBlock(x, y) != 0) {
                        let tileBodyDef: b2BodyDef = new b2BodyDef();
                        tileBodyDef.type = b2BodyType.b2_staticBody;
                        tileBodyDef.position.Set(((x * 32) / 100) + ((32 / 100) / 2), ((y * 32) / 100) + ((32 / 100) / 2));
                        let tileBody: b2Body = simulation.world.CreateBody(tileBodyDef);

                        const tileFixtureDef: b2FixtureDef = new b2FixtureDef();
                        tileFixtureDef.shape = tileHitboxShape;
                        if (layer.level > 0) {
                            tileFixtureDef.filter.Copy(worldAndHitboxCollisionFilter);
                        } else {
                            tileFixtureDef.filter.Copy(worldCollisionFilter);
                        }
                        tileBody.CreateFixture(tileFixtureDef);
                    }
                }
            }
        }

        console.log("Generating items on the map");
        let itemConfigs: IItemConfig[] = this.loadAllItemConfigs();

        let prefferedNumber: number[] = this.rollPrefferedNumber(itemConfigs);
        let numberPlaced: number[] = new Array(itemConfigs.length).fill(0);
        let placedItems: ItemObject[] = [];

        for (let itemPlaceAttempt = 0; itemPlaceAttempt < this.itemsPlaceAttempts; itemPlaceAttempt++) {
            console.log(itemPlaceAttempt);
            let toAttempt: IItemConfig = this.getRandomItem(itemConfigs, numberPlaced, prefferedNumber);
            // If all of the items have been placed to max then toAttempt will be undefined. Exit the loop
            if (!toAttempt) break;

            for (let itemAttempt = 0; itemAttempt < this.itemPlaceAttemptLimit; itemAttempt++) {
                // Select a random place on the map to attempt to place the structure
                let itemX = Math.floor(Math.random() * map.width);
                let itemY = Math.floor(Math.random() * map.height);
                // Check that the item can be placed here
                if (this.checkItemCanBePlaced(map, tiles, itemX, itemY, toAttempt)) {
                    // Check that the this location is open ground
                    if (map.getHighestLevel(itemX, itemY) == 0) {
                        // Check that no item already exists at this location
                        if (!placedItems.find((placed) => placed.body.GetPosition().x == itemX && placed.body.GetPosition().y == itemY)) {
                            // Place the item
                            let placed: ItemObject = new ItemObject(simulation, InventoryItemFactory.createInventoryItem(toAttempt), 0.16 + (32 * itemX) / 100, 0.16 + (32 * itemY) / 100);
                            placed.body.SetAngle(Math.random() * 2 * Math.PI);
                            simulation.addGameObject(placed);
                            placedItems.push(placed);
                            numberPlaced[itemConfigs.indexOf(toAttempt)]++;
                            break;
                        }
                    }
                }
            }
        }

        console.log(placedItems.length + " items placed");

        return map;
    }

    public static checkItemCanBePlaced(map: TerrainMap, tiles: TileDictionary,  x: number, y: number, config: IItemConfig): boolean {
        for (let spawnOption of config.spawnOptions) {
            let conditions: string[] = spawnOption.condition.split("&");

            let allConditionsMet: boolean = true;
            for (let condition of conditions) {
                if (condition.startsWith("@")) {
                    if (!tiles.checkTileIndexIdentifiesAs(map.getHighestTile(x, y), condition)) allConditionsMet = false;
                } else if (condition.startsWith("#")) {
                    let cleanCondition: string = condition.substring(1);

                    let validFound: boolean = false;
                    for (let toCheckY = y - this.itemPlaceCheckRadius; toCheckY <= y + this.itemPlaceCheckRadius; toCheckY++) {
                        for (let toCheckX = x - this.itemPlaceCheckRadius; toCheckX <= x + this.itemPlaceCheckRadius; toCheckX++) {
                            // Make sure the point is on the screen
                            if (x < 0 || y < 0 || x >= map.width || y >= map.height) continue;
                            if (tiles.checkTileIndexIdentifiesAs(map.getHighestTile(toCheckX, toCheckY), cleanCondition)) {
                                validFound = true;
                                break;
                            }
                        }
                        // Don't keep looking if this condition has already been satisfied
                        if (validFound) break;
                    }

                    if (!validFound) allConditionsMet = false;
                } else {
                    if (!(map.getHighestTile(x, y) == tiles.tiles_name.get(condition).id)) allConditionsMet = false;
                }
            }
            if (allConditionsMet) {
                if (spawnOption.successChance > Math.random() * 100) return true;
            }
        }

        return false;
    }

    /**
     * Returns a random structure part excluding the ones that are in the already attempted array. This method considers
     * the rarity of each part and returns parts proportional to this.
     * @param options The parts that this method can return
     * @param alreadyAttempted The parts that this method shouldn't return
     * @return A random structure part
     */
    public static randomStructurePart(options: IStructurePart[], alreadyAttempted: IStructurePart[]) {
        let possibleOptions: IStructurePart[] = options.filter((part) => part.rarity > 0 && !alreadyAttempted.includes(part));

        // Special case where options only includes one element that hasn't been already tried
        if (possibleOptions.length == 1) {
            return possibleOptions[0];
        } else if (possibleOptions.length == 0) {
            return null;
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
        throw "Failed to select random structure part";
    }

    /**
     * Returns a random tile from the given options. This method considers the rarity of each tile and randomly returns
     * tiles proportional to this value
     * @param options The tiles that this function can return
     * @return A random tile
     */
    public static randomTile(options: ITileOption[]): ITileOption {
        while (true) {
            let selected: ITileOption = options[Math.floor(Math.random() * options.length)];
            if ((Math.random() * 100) < selected.rarity) return selected;
        }
    }

    /**
     * Goes through every number and randomly selects a number between the min and the max (including these numbers)
     * @param items The items to roll the preferred number for
     * @return The rolled preferred number of items
     */
    public static rollPrefferedNumber(items: IItemConfig[]): number[] {
        return items.map((item) => {
            return Math.floor(Math.random() * (item.maximumNumberOnMap - item.minimumNumberOnMap + 1) + item.minimumNumberOnMap);
        });
    }

    /**
     * Selects a random item from the list of usable configs excluding items that already have at least their preferred number
     * generated
     * @param options The options that can be selected from
     * @param alreadyGenerated The array whose indices correspond to the options array and gives the number of that item that have already been generated
     * @param preferredNumber The array whose indices correspond to the options array and give the preferred number of each item to generate
     */
    public static getRandomItem(options: IItemConfig[], alreadyGenerated: number[], preferredNumber: number[]) {
        let availableOptions: IItemConfig[] = [];
        for (let i = 0; i < options.length; i++) {
            if (alreadyGenerated[i] < preferredNumber[i]) availableOptions.push(options[i]);
        }
        return availableOptions[Math.floor(Math.random() * availableOptions.length)];
    }

    /**
     * Finds the region that best fits the given climate
     * @param temp The temperature of the region from 0 to 100
     * @param humidity The humidity of the region from 0 to 100
     * @param regions The regions to consider
     * @return The region that best fits the given climate
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
     * @return All of the loaded tile layers
     */
    public static loadAllLayers(): ITileLayer[] {
        return JSON.parse(fs.readFileSync(path.join(".", "src", "game", "config", "terrain", "tiles", "layers.json"), "utf8")) as ITileLayer[];
    }

    /**
     * Loads the tiles json file from the disk and then uses the paths given in it to load all of the available tiles as
     * a tile dictionary
     * @return All of the tiles as a tile dictionary
     */
    public static loadAllTiles(): TileDictionary {
        // Load atlas with paths to other tiles
        let tilesAtlas = JSON.parse(fs.readFileSync(path.join(".", "src", "game", "config", "terrain", "tiles", "tiles.json"), "utf8")) as {tile_files: string[]};

        let tiles: ITile[] = [];
        tilesAtlas.tile_files.forEach((file) => {
           let tilesFromFile: ITile[] = JSON.parse(fs.readFileSync(path.join(".", "src", "game", "config", "terrain", "tiles", file), "utf8")) as ITile[];
           tilesFromFile.forEach((tile) => tiles.push(tile));
        });

        return new TileDictionary(tiles);
    }

    /**
     * Loads the regions json file from the disk and returns its data
     * @return All of the regions that were loaded
     */
    public static loadAllRegions(): IRegion[] {
        return JSON.parse(fs.readFileSync(path.join(".", "src", "game", "config", "terrain", "regions.json"), "utf8")) as IRegion[];
    }

    /**
     * Loads the structures file from the disk and returns its data
     * @return All of the structures that were loaded
     */
    public static loadAllStructures(): IStructure[] {
        return JSON.parse(fs.readFileSync(path.join(".", "src", "game", "config", "terrain", "structures", "structures.json"), "utf8")) as IStructure[];
    }

    /**
     * Loads the structure parts json file that belongs to the given structures and returns its data
     * @param struct The structure to load the parts for
     * @param All of the parts that were loaded for the given structure
     */
    public static loadAllStructureParts(struct: IStructure): IStructurePart[] {
        return JSON.parse(fs.readFileSync(path.join(".", "src", "game", "config", "terrain", "structures", struct.path), "utf8")) as IStructurePart[];
    }

    /**
     * Loads all item configs which are listed in teh atlas.json file for items and returns there data as an array
     */
    public static loadAllItemConfigs(): IItemConfig[] {
        // Load the atlas
        let paths: string[] = JSON.parse(fs.readFileSync(path.join(".", "src", "game", "config", "items", "atlas.json"), "utf8")) as string[];
        // Load every file in the atlas
        return paths.map((configPath) => {
           return JSON.parse(fs.readFileSync(path.join(".", "src", "game", "config", "items", configPath), "utf8")) as IItemConfig;
        });
    }
}
