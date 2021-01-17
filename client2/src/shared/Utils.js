import gameConfig from "./GameConfig";

const Utils = {
    /**
     * Prints a system message in the project format.
     * Wrapper for console.log.
     * @param {*} message
     */
    message(...args) {
        args.unshift("*");
        // eslint-disable-next-line no-console
        console.log(...args);
    },

    /**
     * Prints a warning message.
     * @param {*} message
     */
    warning(...args) {
        args.unshift("* WARNING:");
        // eslint-disable-next-line no-console
        console.warn(...args);
    },

    /**
     * Move the given 2D matrix up.
     * Modifies in place.
     * @param {Array.<Array>} matrix
     */
    shiftMatrixUp(matrix) {
        Utils.shiftArrayLeft(matrix);
    },

    /**
     * Move the given 2D matrix down.
     * Modifies in place.
     * @param {Array.<Array>} matrix
     */
    shiftMatrixDown(matrix) {
        Utils.shiftArrayRight(matrix);
    },

    /**
     * Move the given 2D matrix left.
     * Modifies in place.
     * @param {Array.<Array>} matrix
     */
    shiftMatrixLeft(matrix) {
        matrix.forEach((array) => {
            Utils.shiftArrayLeft(array);
        });
    },

    /**
     * Move the given 2D matrix right.
     * Modifies in place.
     * @param {Array.<Array>} matrix
     */
    shiftMatrixRight(matrix) {
        matrix.forEach((array) => {
            Utils.shiftArrayRight(array);
        });
    },

    /**
     * Move the given array along to the left/backwards.
     * Modifies in place.
     * ["A", "B", "C"] => ["B", "C", "A"]
     * @param {Array} array
     */
    shiftArrayLeft(array) {
        array.push(array.shift());
    },

    /**
     * Move the given array along to the right/forwards.
     * Modifies in place.
     * ["A", "B", "C"] => ["C", "A", "B"]
     * @param {Array} array
     */
    shiftArrayRight(array) {
        array.unshift(array.pop());
    },

    /**
     * Gets a random number between, and including, min and max.
     * @param {Number} min
     * @param {Number} max
     * @returns {*}
     */
    getRandomIntInclusive(min, max) {
        const mini = Math.ceil(min);
        const maxi = Math.floor(max);
        return Math.floor(Math.random() * (maxi - mini + 1)) + mini;
    },

    /**
     * Gets a random element from the given array.
     * @param {Array} array
     * @returns {*}
     */
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Gets the distance in pixels between a sprite and a pointer.
     * @param {Phaser.GameObject.Sprite} baseSprite
     * @param pointer
     * @returns {Number}
     */
    pixelDistanceBetween(baseSprite, pointer) {
        // return Math.abs(baseSprite.worldPosition.x - pointer.clientX) + Math.abs(baseSprite.worldPosition.y - pointer.clientY);
    },

    /**
     * Hashes a message.
     * Useful for securing passwords before sending.
     * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#Converting_a_digest_to_a_hex_string
     * @param {String} message
     */
    async digestMessage(message) {
        const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
        const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
        return hashHex;
    },

    /**
     * Gets the text for a given definition ID for the selected language from the text definitions catalogue.
     * Defaults to English if the definition is not found in the selected language.
     * @param {String} definitionID
     */
    getTextDef(definitionID) {
        const text = gameConfig.TextDefs[gameConfig.language][definitionID];
        // Check if definition is defined for selected language.
        if (text === null) {
            // Use English instead.
            return gameConfig.TextDefs.English[definitionID];
        }
        // Check if the text def is even defined.
        if (text === undefined) return "???";
        // Return the text, in the selected language.
        return text;
    },
};

export default Utils;