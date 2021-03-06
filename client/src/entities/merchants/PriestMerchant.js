import Merchant from "./Merchant";
import NPCShopTypes from "./../../catalogues/NPCShopTypes.json";

class Entity extends Merchant {
    constructor(x, y, config) {
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Priest"));
        this.baseSprite.setFrame("trader-priest-1");
        this.npcShopType = NPCShopTypes.Respawns;
    }
}

export default Entity;