const ResourceNode = require("./ResourceNode");
const Item = require('../../../../ItemsList').DungiumOre;

class DungiumOre extends ResourceNode {}

DungiumOre.prototype.ItemType = Item;
DungiumOre.prototype.interactionEnergyCost = 2;
DungiumOre.prototype.interactionDurabilityCost = 1;
DungiumOre.prototype.reactivationRate = 30000;
DungiumOre.prototype.requiredToolCategory = Item.prototype.categories.Pickaxe;
DungiumOre.prototype.warningEvent = DungiumOre.prototype.EventsList.pickaxe_needed;
DungiumOre.prototype.gloryGiven = 15;
DungiumOre.prototype.taskIDGathered = require("../../../../tasks/TaskTypes").GatherDungiumOre.taskID;

module.exports = DungiumOre;