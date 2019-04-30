import { IPlacedStructurePart } from "./IPlacedStructurePart";
import { IStructureConnection } from "./IStructureConnection";

export interface IPlacedStructurePartConnection {
    x: number;
    y: number;
    owner: IPlacedStructurePart;
    template: IStructureConnection;
    bondedWith: IPlacedStructurePartConnection;
}