const Utils = require("../Utils");
const StatNames = require('../stats/Statset').prototype.StatNames;
const getRandomIntInclusive = Utils.getRandomIntInclusive;

const Item = {
    name: "",

    /**
     * How much each unit of this item weighs.
     * @type {Number}
     */
    weight: 0,

    /**
     * A list of the categories applied to this item.
     * @type {Array}
     */
    categories: [],

    /**
     * The ID of this item in the language text definitions file.
     * Just the item name itself, which is added onto the "Item name: " prefix to get the actual ID.
     * @type {String}
     */
    idName = 'ID name not set.',

    iconSource = "Icon source not set.",

    /**
     * The type of entity to be added to the board if this item is dropped on the ground. The class itself, NOT an instance of it.
     * If left null, the item to drop will disappear and won't leave anything on the ground.
     * @type {Function}
     */
    PickupType: null,

    expGivenOnUseList: [],

    /**
     * How much crafting exp this item contributes a the recipe it is used in.
     * @type {Number}
     */
    craftingExpValue: 10,

    /**
     * Activate the effect of this item. i.e. Restore energy, equip armour, use tool.
     */
    use(player) {
        this.onUsed(usedBy);
    },

    onUsed(player) {
        // Something might have happened to the owner of this item when it was used by them.
        // Such as eating a greencap on 1 HP to suicide.
        if (usedBy.hitPoints < 1) return;

        // Check if this item gives any stat exp when used.
        if (usedBy.stats[this.expGivenStatName] !== undefined) {
            usedBy.stats[this.expGivenStatName].gainExp(this.expGivenOnUse);
        }

        // Check if this item should lose some quantity when used.
        if (this.useQuantityCost > 0) {
            if (this.expGivenStatName !== null) {
                // TODO: Stat level bonus logic here
            }
        }
    },

    useGatheringTool(player) {
        // Get position of the grid tile in front of the owner of this item.
        const directionOffset = player.board.directionToRowColOffset(player.direction);

        // Get the static entity in that grid tile.
        const interactable = player.board.grid[player.row + directionOffset.row][player.col + directionOffset.col].static;

        // Check the tile actually has a static on it.
        if (interactable === null) return;

        // Check it is an interactable.
        if (interactable.interaction === undefined) return;

        // This item is used on resource nodes, which are interactables.
        interactable.interaction(this.owner, this);
    },

    drop(player, quantity) {
        player.inventory.dropItem(this.typeName, quantity);
    }

}

// Give all Items easy access to the finished EntitiesList.
// Needs to be done when all entities are finished initing,
// or accessing entities causes errors. Done in index.js.
Item.prototype.EntitiesList = {};

Item.prototype.StatNames = StatNames;

Item.prototype.ItemExpGiven = (statName, amount) => {
    this.statName = statName || null;
    this.amount = amount || 0;
};

/**
 * Useful for grouping similar items for checking if a certain kind of tool was
 * used, regardless of what specific tool it was. i.e. any hatchet can be used
 * to cut a tree, so just check for the Hatchet category on the item.
 */
Item.prototype.ItemCategories = {
    Hatchet: "Hatchet",
    Pickaxe: "Pickaxe",
    Weapon: "Weapon",
    Clothing: "Clothing",
    FighterKey: "FighterKey",
    PitKey: "PitKey",
}

module.exports = Item;