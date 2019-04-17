export interface GradientVector {
    x: number;
    y: number;
}

export class NoiseMap {
    /**
     * The size of the chunks to use to generate the gradient
     */
    public chunkSize: number;
    /**
     * The width of the noise map
     */
    public width: number;
    /**
     * The height of the noise map
     */
    public height: number;
    /**
     * The computed noise map
     */
    public map: number[][];

    constructor(width: number, height: number, chunkSize: number) {
        this.width = width;
        this.height = height;
        this.chunkSize = chunkSize;
        this.createPerlinNoise();
    }

    private createPerlinNoise(): void {
        let gradientWidth = Math.ceil(this.width / this.chunkSize);
        let gradientHeight = Math.ceil(this.height / this.chunkSize);
        let gradient: GradientVector[][] = NoiseMap.createRandomGradientMap(gradientWidth + 1, gradientHeight + 1);

        this.map = new Array(this.height);
        for (let y = 0; y < this.height; y++) {
            let row = new Array(this.width);
            for (let x = 0; x < this.width; x++) {
                row[x] = NoiseMap.perlin(gradient, x, y, this.chunkSize);
            }
            this.map[y] = row;
        }
    }

    private static perlin(gradient: GradientVector[][], x: number, y: number, chunkSize: number): number {
        let x0 = Math.floor(x / chunkSize);
        let x1 = x0 + 1;
        let y0 = Math.floor(y / chunkSize);
        let y1 = y0 + 1;

        let sx = (x / chunkSize) - x0;
        let sy = (y / chunkSize) - y0;

        let n0 = NoiseMap.dotGridGradient(gradient, x0, y0, x, y, chunkSize);
        let n1 = NoiseMap.dotGridGradient(gradient, x1, y0, x, y, chunkSize);
        let ix0 = NoiseMap.linearInterpolate(n0, n1, sx);

        n0 = NoiseMap.dotGridGradient(gradient, x0, y1, x, y, chunkSize);
        n1 = NoiseMap.dotGridGradient(gradient, x1, y1, x, y, chunkSize);
        let ix1 = NoiseMap.linearInterpolate(n0, n1, sx);

        return NoiseMap.linearInterpolate(ix0, ix1, sy);
    }

    private static createRandomGradientMap(gradientWidth: number, gradientHeight: number): GradientVector[][] {
        let gradient: GradientVector[][] = new Array(gradientHeight);
        for (let y = 0; y < gradientHeight; y++) {
            let row: GradientVector[] = new Array(gradientWidth);
            for (let x = 0; x < gradientWidth; x++) {
                // Generate a random angle on the unit circle and get the point
                let theta = Math.random() * 2 * Math.PI;
                row[x] = {x: Math.cos(theta), y: Math.sin(theta)}
            }
            gradient[y] = row;
        }
        return gradient;
    }

    private static linearInterpolate(a0: number, a1: number, weight: number): number {
        return ((1.0 - weight) * a0) + weight * a1;
    }
    private static dotGridGradient(gradient: GradientVector[][], ix: number, iy: number, x: number, y: number, chunkSize: number): number {
        let dx: number = (x / chunkSize) - ix;
        let dy: number = (y / chunkSize) - iy;
        return (dx * gradient[iy][ix].x) + (dy * gradient[iy][ix].y);
    }
}