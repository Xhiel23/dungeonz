import Character from "./Character";

class Entity extends Character {
    constructor(x, y, config){
        super(x, y, config);
  
        this.displayName.setText(dungeonz.getTextDef("Mob name: Berserker"));
    }
}

Entity.prototype.animationSetName = "warrior";

export default Entity;