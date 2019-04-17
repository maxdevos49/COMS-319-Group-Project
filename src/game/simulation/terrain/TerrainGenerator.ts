import { TerrainMap } from "../../../public/javascript/game/models/TerrainMap";
import { GameSimulation } from "../GameSimulation";
import * as fs from "fs";
import { ITile } from "./ITile";

export class TerrainGenerator {
    private static chunkSize: number = 20;

    public static generateTerrain(simulation: GameSimulation, map: TerrainMap) {
        let tiles: ITile[] = this.loadAllTiles();
    }

    public static loadAllTiles(): ITile[] {
        // Load atlas with paths to other tiles
        let tilesAtlas = JSON.parse(fs.readFileSync("tiles/tiles.json", "utf8")) as {tile_files: string[]};

        let tiles: ITile[] = [];
        tilesAtlas.tile_files.forEach((file) => {
           let tilesFromFile: ITile[] = JSON.parse(fs.readFileSync("tiles/" + file, "utf8")) as ITile[];
           tilesFromFile.forEach((tile) => tiles.push(tile));
        });

        return tiles;
    }
}
