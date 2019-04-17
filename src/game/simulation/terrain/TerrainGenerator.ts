import { TerrainMap } from "../../../public/javascript/game/models/TerrainMap";
import { GameSimulation } from "../GameSimulation";
import * as fs from "fs";
import { ITile } from "./ITile";
import * as path from "path";
import { IRegion } from "./IRegion";

export class TerrainGenerator {
    private static chunkSize: number = 20;

    public static generateTerrain(simulation: GameSimulation, map: TerrainMap) {
        let tiles: Map<string, ITile> = this.loadAllTiles();
        let regions: IRegion[] = this.loadAllRegions();

        
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
}
