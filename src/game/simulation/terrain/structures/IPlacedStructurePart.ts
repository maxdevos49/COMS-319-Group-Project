import { IStructurePart } from "./IStructurePart";
import { IPlacedStructurePartConnection } from "./IPlaceedStructurePartConnection";

export interface IPlacedStructurePart {
    x: number,
    y: number,
    template: IStructurePart;
    connections: IPlacedStructurePartConnection[];
}