const Item = require('./Item');

const ItemBloodGem = Object.create(Item);

Object.assign(ItemBloodGem, {
    name: "BloodGem",
    idName: "Blood gem",
    iconSource: "icon-blood-gem",
    PickupType: require('../entities/destroyables/pickups/PickupBloodGem'),
    weight: 5,
    craftingExpValue: 40,
});

class ItemBloodGem extends Item { }
// This item needs to be exported before the pickup type that it is linked to accesses it.
module.exports = ItemBloodGem;

ItemBloodGem.prototype.registerItemType();
