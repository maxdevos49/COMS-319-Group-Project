import { ITileOption } from "./tiles/ITile";

export interface IRegion {
    name: string;
    tiles: ITileOption[];
    humidity: number;
    temperature: number;
}