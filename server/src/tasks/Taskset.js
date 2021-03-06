class Taskset {
    /**
     * A new set of tasks. Can be continued from what tasks the player had before.
     * @param {Player} owner
     */
    constructor(owner) {

        this.owner = owner;

        this.list = {};
    }

    /**
     *
     * @param {Task} task
     * @param {Number} [progress] - Optional progress to start this task at.
     */
    /*addTask (task, progress) {
        // Don't add the task if there is already one with that ID.
        if(this.list[task.taskID] !== undefined){
            console.log("* WARNING: Attempt to add a task progress with a task ID that is already in use:", task.taskType.name);
            return;
        }

        //this.list[task.taskID] = new TaskProgress(this.owner, task, progress);

        // Tell the client to add the task.
        //this.owner.socket.sendEvent(this.owner.EventsList.task_added, {taskID: task.taskID, progress: this.list[task.taskID].progress});
    }*/

    /**
     * Increase the progress made in this task.
     * @param {String} taskID
     */
    progressTask(taskID) {
        if (this.list[taskID] === undefined) return;
        this.list[taskID].progressMade();
    }

    // The owner has no task progress so far, give them the starting tasks.
    addStartingTasks() {
        this.owner.tasks.list = {};
        new Task.Task(this.owner, TaskTypes.KillRats, 0, 5, [ItemsList.IronHammer], 500);
        new Task.Task(this.owner, TaskTypes.KillBats, 0, 5, [ItemsList.IronArmour], 500);
        new Task.Task(this.owner, TaskTypes.GatherIronOre, 0, 5, [ItemsList.DungiumPickaxe], 500);
        new Task.Task(this.owner, TaskTypes.GatherCotton, 0, 5, [ItemsList.ExpOrbGathering], 500);
        new Task.Task(this.owner, TaskTypes.CraftIronDaggers, 0, 5, [ItemsList.NoctisDagger], 500);
        new Task.Task(this.owner, TaskTypes.CraftPlainRobes, 0, 5, [ItemsList.ExpOrbArmoury], 500);
    }

    getEmittableTasks() {
        const emittableTasks = {};

        Object.entries(this.list).forEach(([taskID, task]) => {
            const rewardItemTypeNumbers = [];

            task.rewardItemTypes.forEach((itemType, i) => {
                if (!itemType) return;
                rewardItemTypeNumbers[i] = task.rewardItemTypes[i].prototype.typeNumber;
            });

            emittableTasks[taskID] = {
                taskID: task.taskType.taskID,
                progress: task.progress,
                completionThreshold: task.completionThreshold,
                rewardItemTypeNumbers: rewardItemTypeNumbers,
                rewardGlory: task.rewardGlory,
            }
        });

        return emittableTasks;
    }

}

module.exports = Taskset;

//const TaskProgress = require("./TaskProgress.js");
const Task = require("./Task");
const TaskTypes = require("./TaskTypes");
const ItemsList = require("../ItemsList");
