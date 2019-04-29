import { IStructureConnection } from "./IStructureConnection";

export interface IStructurePart {
    name: string;
    rarity: number;
    rarity_usage_decrease: number;
    width: number,
    height: number;
    structure: string[][];
    connections: IStructureConnection[];
}