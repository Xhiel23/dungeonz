const Utils = require('../Utils');
const idCounter = new Utils.Counter();

class Party {
    /**
     * @param {Player} player - The player that created this party, who will be the leader.
     */
    constructor(dungeonManager, player) {

        this.id = idCounter.getNext();

        /**
         * @type {Boolean} Whether this party has entered a dungeon yet.
         */
        this.inDungeon = false;

        //this.dungeonManager = dungeonManager;

        /**
         * @type {Array.<Player>} A list of players in this party. [0] is the party leader.
         */
        this.members = [player];

        /**
         * @type {Array.<Number>} A list of player entity IDs of players that have been kicked from this party.
         * @todo Might want to use a player account ID instead of entity ID here otherwise they can refresh the
         * game and will have a different entity ID and can then join the party they were kicked form.
         */
        this.kickedList = [];

        /**
         * @type {Boolean} Whether this party is only for clan members of the leader.
         */
        this.clanOnly = false;
    }

    destroy() {
        //delete this.dungeonManager;
        delete this.members;
        delete this.kickedList;
    }

    // addPlayer(player) {
    //     // Don't add them if they have previously been kicked.
    //     if (this.kickedList.includes(player.id)) return;
    //     // Don't add them if they are already in the party.
    //     if (this.members.some((member) => member === player)) return;

    //     if (this.clanOnly) {
    //         // Check they are in the same clan as the party leader.
    //         // TODO: when clans are added
    //         //if(player.clan.id !== this.members[0].clan.id) return;
    //     }

    //     this.members.push(player);
    // }

    // removePlayer(player) {
    //     // If the player to remove is the leader, disband the party.
    //     if (player === this.members[0]) {
    //         // Tell all members that the party has been disbanded.
    //         // TODO

    //         if(this.inDungeon){
    //             this.dungeonManager
    //         }
    //         else {
    //             // Tell the dungeon manager to remove this party.
    //             this.dungeonManager.removeParty(this);
    //         }

    //         this.members = [];
    //     }
    //     else {
    //         this.members = this.members.filter((member) => member === player);
    //     }
    // }

    kickPlayer(kickedBy, player) {
        // Only allow the party leader to kick.
        if (kickedBy !== this.members[0]) return;

        this.removePlayer(player);

        // Add them to the kicked list so they can't rejoin.
        this.kickedList.push(player.id);
    }
}

module.exports = Party;