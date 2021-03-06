const Breakable = require('./Breakable');

class DoorLockedPit extends Breakable {

    interaction (interactedBy, toolUsed) {
        // Don't do anything to this door if it is not active.
        if(this.activeState === false) return;

        // Don't do anything if no tool was used. Might have been walked into.
        if(toolUsed === undefined) return;

        // Don't do anything to this node if the wrong tool has been used on it.
        if(toolUsed.category !== this.requiredToolCategory) {
            // Tell the player if they are using the wrong tool.
            interactedBy.socket.sendEvent(this.warningEvent);
            return;
        }

        // Reduce the durability of the key used.
        toolUsed.modDurability(-this.interactionDurabilityCost);

        // Check any task progress was made.
        interactedBy.tasks.progressTask(this.taskIDInteracted);

        // The door is now open, so stop it from blocking players.
        this.deactivate();

        this.blocking = false;
    }

    activate () {
        super.activate();
        // If the door was successfully activated (nothing standing on the open door), make it block things.
        if(this.activeState === true) this.blocking = true;
    }

}
module.exports = DoorLockedPit;

DoorLockedPit.prototype.interactionDurabilityCost = 1;
DoorLockedPit.prototype.reactivationRate = 5000;
DoorLockedPit.prototype.requiredToolCategory = require('./../../../../items/Item').prototype.categories.PitKey;
DoorLockedPit.prototype.warningEvent = DoorLockedPit.prototype.EventsList.key_needed;