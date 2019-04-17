import { TerrainMap } from "../../../public/javascript/game/models/TerrainMap";
import { GameSimulation } from "../GameSimulation";
import * as fs from "fs";
import { ITile, ITileOption } from "./tiles/ITile";
import * as path from "path";
import { IRegion } from "./IRegion";
import { NoiseMap } from "./NoiseMap";
import { IStructure, IStructurePart } from "./structures/IStructure";

export class TerrainGenerator {
    private static chunkSize: number = 64;

    public static generateTerrain(simulation: GameSimulation, map: TerrainMap) {
        let tiles: Map<string, ITile> = this.loadAllTiles();
        let regions: IRegion[] = this.loadAllRegions();

        let temperatureMap: NoiseMap = new NoiseMap(map.width, map.height, this.chunkSize);
        let humidityMap: NoiseMap = new NoiseMap(map.width, map.height, this.chunkSize);

        // Loop through every tile and assign it a random tile based on the region that best fits
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                let region: IRegion = this.findBestFitRegion(temperatureMap.map[y][x], humidityMap.map[y][x], regions);
                map.data[y][x] = tiles.get(this.randomTile(region.tiles).name).index;
            }
        }
    }

    public static attemptPlaceStructure()

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

    public static loadAllTiles(): Map<string, ITile> {
        // Load atlas with paths to other tiles
        let tilesAtlas = JSON.parse(fs.readFileSync(path.join(__dirname, "tiles", "tiles.json"), "utf8")) as {tile_files: string[]};

        let tiles: Map<string, ITile> = new Map<string, ITile>();
        tilesAtlas.tile_files.forEach((file) => {
           let tilesFromFile: ITile[] = JSON.parse(fs.readFileSync(path.join(__dirname, "tiles", file), "utf8")) as ITile[];
           tilesFromFile.forEach((tile) => tiles.set(tile.name, tile));
        });

        return tiles;
    }

    public static loadAllRegions(): IRegion[] {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "regions.json"), "utf8")) as IRegion[];
    }

    public static loadAllStructures(): Map<IStructure, IStructurePart[]> {
        // Load the array of all of the structures
        let structures: IStructure[] = JSON.parse(fs.readFileSync(path.join(__dirname, "structures", "structures.json"), "utf8")) as IStructure[];
        // Load all of the parts for each structure
        let structMap: Map<IStructure, IStructurePart[]> = new Map<IStructure, IStructurePart[]>();
        structures.forEach((struct: IStructure) => {
            structMap.set(struct, JSON.parse(fs.readFileSync(path.join(__dirname, "structures", struct.path), "utf8")) as IStructurePart[]);
        });
        return structMap;
    }
}
