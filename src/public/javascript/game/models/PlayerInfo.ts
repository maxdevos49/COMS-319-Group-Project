export class PlayerInfo {
    /**
     * The id of this player
     */
    public id: string;

    /**
     * The name of this player
     */
    public name: string;

    /**
     * The role of this player
     */
    public role: string;

    /**
     * Constructs a new PlayerUpdate
     * @param id The id of this player
     * @param name The name of this player
     * @param role The role of this player
     */
    constructor(id: string, name: string, role: string) {
        this.id = id;
        this.name = name;
        this.role = role;
    }
}