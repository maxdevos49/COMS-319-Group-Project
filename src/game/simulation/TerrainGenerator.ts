import { TerrainMap } from "../../public/javascript/game/models/game/TerrainMap";

export class TerrainGenerator {
    private static chunkSize: number = 20;

    public static fillTerrain(map: TerrainMap) {
        // Compute the gradient vector the chunk grids
        let gradient: number[][][] = [];
        for (let y = 0; y < Math.ceil(map.height / this.chunkSize) + 1; y++) {
            let row: number[][] = [];
            for (let x = 0; x < Math.ceil(map.width / this.chunkSize) + 1; x++) {
                let vector: number[] = [];
                vector[0] = (Math.random() * 2) - 1;
                vector[1] = (Math.random() * 2) - 1;
                // Normalize the vectors
                let length = Math.sqrt((vector[0] * vector[0]) + (vector[1] * vector[1]));
                vector[0] /= length;
                vector[1] /= length;
                row[x] = vector;
            }
            gradient[y] = row;
        }
        // Perform perlin on every point in the map
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                let value: number = this.perlin(gradient, x, y);
                if (value >= -0.15) {
                    map.data[y][x] = 0;
                } else if (value >= -0.21) {
                    map.data[y][x] = 2;
                } else if (-0.21 > value) {
                    map.data[y][x] = 1;
                }
            }
        }
    }
    private static linearInterpolate(a0: number, a1: number, weight: number): number {
        return ((1.0 - weight) * a0) + weight * a1;
    }
    private static dotGridGradient(gradient: number[][][], ix: number, iy: number, x: number, y: number): number {
        let dx: number = (x / this.chunkSize) - ix;
        let dy: number = (y / this.chunkSize) - iy;
        return (dx * gradient[iy][ix][0]) + (dy * gradient[iy][ix][1]);
    }
    private static perlin(gradient: number[][][], x: number, y: number): number {
        let x0 = Math.floor(x / this.chunkSize);
        let x1 = x0 + 1;
        let y0 = Math.floor(y / this.chunkSize);
        let y1 = y0 + 1;

        let sx = (x / this.chunkSize) - x0;
        let sy = (y / this.chunkSize) - y0;

        let n0 = TerrainGenerator.dotGridGradient(gradient, x0, y0, x, y);
        let n1 = TerrainGenerator.dotGridGradient(gradient, x1, y0, x, y);
        let ix0 = TerrainGenerator.linearInterpolate(n0, n1, sx);

        n0 = TerrainGenerator.dotGridGradient(gradient, x0, y1, x, y);
        n1 = TerrainGenerator.dotGridGradient(gradient, x1, y1, x, y);
        let ix1 = TerrainGenerator.linearInterpolate(n0, n1, sx);

        return TerrainGenerator.linearInterpolate(ix0, ix1, sy);
    }

}