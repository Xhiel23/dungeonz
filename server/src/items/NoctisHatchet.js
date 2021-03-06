const Item = require("./Item");

class NoctisHatchet extends Item {

    use () {
        this.useGatheringTool();
    }

}

NoctisHatchet.translationID = "Noctis hatchet";
NoctisHatchet.iconSource = "icon-noctis-hatchet";
NoctisHatchet.prototype.category = Item.prototype.categories.Hatchet;
NoctisHatchet.prototype.baseDurability = 40;
NoctisHatchet.prototype.expGivenStatName = NoctisHatchet.prototype.StatNames.Gathering;
NoctisHatchet.prototype.expGivenOnUse = 10;

module.exports = NoctisHatchet;