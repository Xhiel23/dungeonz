
const Sprite = function (x, y, config) {
    Phaser.Sprite.call(this, _this.game, x, y, 'game-atlas', 'pickup-oak-logs');

    this.scale.setTo(GAME_SCALE);

    this.tweenPickupFromCenter();
};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

module.exports = Sprite;