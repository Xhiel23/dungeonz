const Character = require('./Character');

const Sprite = function (x, y, config) {
    Character.call(this, x, y, config);
    this.displayName.setText(dungeonz.getTextDef("Mob name: Dwarf"));

    this.baseSprite.animations.add('u', ['dwarf-up-1', 'dwarf-up-2', 'dwarf-up-1', 'dwarf-up-3'], 10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('d', ['dwarf-down-1', 'dwarf-down-2', 'dwarf-down-1', 'dwarf-down-3'], 10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('l', ['dwarf-left-1', 'dwarf-left-2', 'dwarf-left-1', 'dwarf-left-3'], 10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('r', ['dwarf-right-1', 'dwarf-right-2', 'dwarf-right-1', 'dwarf-right-3'], 10).onComplete.add(this.moveAnimCompleted, this);
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.baseFrames = {
    u: 'dwarf-up-1',
    d: 'dwarf-down-1',
    l: 'dwarf-left-1',
    r: 'dwarf-right-1'
};

module.exports = Sprite;