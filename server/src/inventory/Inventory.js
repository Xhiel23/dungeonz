class ItemStack {
    constructor(type, quantity) {
        this._type = type;
        this.quantity = quantity;
        this.stackWeight = type.weight * quantity;
    }

    modQuantity(amount, player) {
        this.quantity += amount;
        this.stackWeight = this._type.weight * this.quantity;
        // Tell the player the new durability.
        player.socket.sendEvent(player.EventsList.durability_value, {
            durability: this.durability,
            slotKey: this.slotKey
        });
    }
}

// making them be craftable upgrades creates demand for resources, vs being
// gradually increased by other things, like extra weight per stat level gained
const maxWeightCapacityModifiers = {};

class Inventory {
    constructor(owner) {
        this.owner = owner;

        // Items, accessed by their item type.
        this.items = {};

        this.currentWeight = 0;
        this.maxWeight = 1000;

        this.hotbar = [];
        this.holding = null;
        this.clothing = null;
        this.ammunition = null;
    }

    addItem(type, quantity) {
        if (!ItemTypes[type.name]) return;
        if (quantity < 1) return;

        const newCurrentWeight = this.currentWeight + (type.weight * quantity);

        // Don't let them go overweight.
        if (newCurrentWeight > this.maxWeight) return;

        this.currentWeight = newCurrentWeight;

        const item = this.items[type.name];
        // If the item is already present, just increase its quantity.
        if (item) {
            item.modQuantity(quantity, this.owner);
        }
        // Add it as a new item.
        else {
            this.items[type.name] = new ItemStack(type, quantity);
        }
    }

    removeItem(type, quantity) {
        if (!this.items[type.name]) return;

        const item = this.items[type.name];

        // If quantity not given, remove all.
        if (!quantity || quantity < 1) {
            quantity = item.quantity;
        };

        const totalItemWeight = type.weight * quantity;

        this.currentWeight -= totalItemWeight;

        // If (somehow) gone underweight, reset weight.
        if (this.currentWeight < 0) this.currentWeight = 0;

        item.modQuantity(-type.useQuantityCost, this.owner);

        // If there are no more of this item left, remove it from the items list.
        if (item.quantity < 1) {
            delete this.items[type.name];
        }
    }

    getItems() {
        return this.items;
    }

    useItem(type) {
        if (!type) return;
        if (!this.items[type.name]) return;

        const item = this.items[type.name];

        item.use();

        //this.removeItem(type, type.useQuantityCost);
    }

    useHeldItem() {
        this.holding.useWhileHeld();
    }

    equipHoldable() { }

    unequipHoldable() { }

    dropItem(type, quantity) {
        // If no pickup type set, remove the item without leaving a pickup on the ground.
        if (this.PickupType === null) {
            player.inventory.removeItem(type);
            return;
        }

        // Add a pickup entity of that item to the board.
        new this.PickupType({
            row: this.owner.row,
            col: this.owner.col,
            board: this.owner.board,
            quantity
        }).emitToNearbyPlayers();

        this.removeItem(type, quantity);
    }

}

module.exports = Inventory;