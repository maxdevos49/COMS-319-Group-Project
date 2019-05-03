import { ITileOption } from "./tiles/ITileOption";

export interface IRegion {
    name: string;
    tiles: ITileOption[];
    humidity: number;
    temperature: number;
}