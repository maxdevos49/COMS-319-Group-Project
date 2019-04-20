export interface IStructure {
    name: string;
    path: string;
    generatesOn: string;
    rarity: number;
    maxParts: number;
    minParts: number;
}

export interface IStructurePart {
    name: string;
    rarity: number;
    rarity_usage_decrease: number;
    width: number,
    height: number;
    structure: string[][];
    connections: IStructureConnection[];
}

export interface IPlacedStructurePart {
    x: number,
    y: number,
    template: IStructurePart;
    connections: IPlacedStructurePartConnection[];
}

export interface IStructureConnection {
    x: number;
    y: number;
    connection_direction: string;
    expects: string;
    required: boolean;
}

export interface IPlacedStructurePartConnection {
    x: number;
    y: number;
    owner: IPlacedStructurePart;
    template: IStructureConnection;
    bondedWith: IPlacedStructurePartConnection;
}

export function getConnectionDirectionOffset(dir: string): {dx: number, dy: number} {
    switch (dir) {
        case "east": return {dx: 1, dy: 0};
        case "north": return {dx : 0, dy: -1};
        case "west": return {dx: -1, dy: 0};
        case "south": return {dx: 0, dy: 1};
        default: return {dx: 0, dy: 0};
    }
}