export interface IStructureConnection {
    x: number;
    y: number;
    connection_direction: string;
    expects: string;
    required: boolean;
    requiredOnInit?: boolean;
}

export function getConnectionDirectionOffset(dir: string): { dx: number, dy: number } {
    switch (dir) {
        case "east":
            return {dx: 1, dy: 0};
        case "north":
            return {dx: 0, dy: -1};
        case "west":
            return {dx: -1, dy: 0};
        case "south":
            return {dx: 0, dy: 1};
        default:
            return {dx: 0, dy: 0};
    }
}