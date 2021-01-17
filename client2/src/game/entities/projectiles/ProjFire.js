import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-fire");
        this.alpha = 0.9;
    }

    onMove() {
        window.gameScene.tilemap.updateDarknessGrid();
    }
}

Entity.prototype.lightDistance = 5;
Entity.prototype.directionAngleSet = Projectile.prototype.CardinalDirectionAngles;

export default Entity;