export interface IStructure {
    name: string;
    path: string;
    generatesOn: string[];
    rarity: number;
}

export interface IStructurePart {
    name: string;
    rarity: number;
    width: number,
    height: number;
    structure: string[][];
    connections: IStructureConnection[];
}

export interface IStructureConnection {
    x: number;
    y: number;
    expects: string[];
    required: boolean;
}