
const wss = require('./Server');
const Utils = require('./utils');
const AccountManager = require('./AccountManager');
//const clanManager = require('./gameplay/ClanManager');
const DungeonManager = require('./dungeon/DungeonManager');
const DungeonManagersList = require('./dungeon/DungeonManagersList');
const EventsList = require('./EventsList');
const BoardsList = require('./board/BoardsList');
const DayPhases = require('./DayPhases');

// Set up the day phase cycle.
const dayPhaseCycle = [];
Utils.arrayMultiPush(dayPhaseCycle, DayPhases.Day, 12);
Utils.arrayMultiPush(dayPhaseCycle, DayPhases.Dusk, 1);
Utils.arrayMultiPush(dayPhaseCycle, DayPhases.Night, 12);
Utils.arrayMultiPush(dayPhaseCycle, DayPhases.Dawn, 1);
// Keep the length of a whole day the same, regarless of how many cycle phases each day has.
const dayPhaseRate = (60000 * 24) / dayPhaseCycle.length;

const world = {

    accountManager: AccountManager,

    /** @type {Number} How many players are currently in the game. */
    playerCount: 0,

    /** @type {Number} How many players can be in the game at once. */
    maxPlayers: 1000,

    /** @type {Array.<Board>} A list of board in the world, by index. */
    boardsArray: BoardsList.boardsArray,

    /** @type {Object.<Board>} A list of boards in the world, by their ID. */
    boardsObject: BoardsList.boardsObject,

    /** @type {Number} The time of day. Dawn, night, etc. */
    dayPhase: DayPhases.Day,

    init() {
        // Read each of the map data files in the map directory and load them.
        const fs = require('fs');
        const dirs = fs.readdirSync('map', { encoding: 'utf-8', withFileTypes: true });
        const path = require('path');

        dirs.forEach((elem) => {
            const parsed = path.parse(elem.name);
            // Skip the blank template map.
            if (parsed.name === "BLANK") return;

            // Only load JSON map data.
            if (parsed.ext === ".json") {
                this.createBoard(parsed.name);
                // Do this after the board/dungeon manager is created, or the client board data won't
                // have the dungeon manager ID to use for any dungeon portals that need that ID.
                Board.createClientBoardData(parsed.name);
            }

        });

        // Load the clans into the game world after the boards are
        // created, or there will be nothing to add the structures to.
        //clanManager.loadDataFromFile();

        // Wire up all of the exits to the entrances of each board.
        // Need to do this after the boards have been created, otherwise
        // there might be nothing to link to while the exits are being created.
        this.linkExits();

        this.linkDungeonManagerEvictionBoards();

        // Start the day/night cycle loop.
        //setTimeout(world.progressTime, dayPhaseRate);
    },

    /**
     * Create an instance of a board for a map that should
     * exist at the start and not be added in later.
     * @param {String} dataFileName - The end part of the URL to the map data file.
     */
    createBoard(dataFileName) {
        const data = require('../map/' + dataFileName + '.json');

        const mapProperties = Utils.arrayToObject(data.properties, 'name', 'value');

        // Skip disabled maps.
        if (mapProperties['Disabled'] === true) {
            Utils.message("Skipping disabled map:", dataFileName);
            return;
        }

        let alwaysNight = false;
        if (mapProperties['AlwaysNight'] == undefined) Utils.warning("Map data is missing property: 'AlwaysNight'. Using default (false). On map: " + dataFileName);
        if (mapProperties['AlwaysNight'] === true) alwaysNight = true;

        if (mapProperties['IsDungeon'] == undefined) Utils.warning("Map data is missing property: 'IsDungeon'. Using default (false). On map: " + dataFileName);
        if (mapProperties['IsDungeon'] === true) {
            if (!mapProperties['Difficulty']) Utils.warning("Dungeon map is missing property: 'Difficulty'. Using default. On map: " + dataFileName);
            if (!mapProperties['NameDefinitionID']) Utils.warning("Dungeon map is missing property: 'NameDefinitionID'. Using default. On map: " + dataFileName);
            if (!mapProperties['MaxPlayers']) Utils.warning("Dungeon map is missing property: 'MaxPlayers'. Using default. On map: " + dataFileName);
            if (!mapProperties['TimeLimitMinutes']) Utils.warning("Dungeon map is missing property: 'TimeLimitMinutes'. Using default. On map: " + dataFileName);
            if (!mapProperties['EvictionMapName']) Utils.warning("Dungeon map is missing property: 'EvictionMapName'. Using default. On map: " + dataFileName);
            if (!mapProperties['EvictionEntranceName']) Utils.warning("Dungeon map is missing property: 'EvictionEntranceName'. Using default. On map: " + dataFileName);

            new DungeonManager({
                name: dataFileName,
                nameDefinitionID: mapProperties['NameDefinitionID'],
                mapData: data,
                alwaysNight,
                maxPlayers: mapProperties['MaxPlayers'],
                timeLimitMinutes: mapProperties['TimeLimitMinutes'],
                difficultyName: mapProperties['Difficulty'],
                evictionMapName: mapProperties['EvictionMapName'],
                evictionEntranceName: mapProperties['EvictionEntranceName']
            });

            // Stop here. Don't create a board for a dungeon map, as they are created
            // dynamically when a dungeon instance is created by the dungeon manager.
            return;
        }

        const board = new Board(data, dataFileName, alwaysNight);
        if (board.alwaysNight === false) {
            board.dayPhase = this.dayPhase;
        }

        this.boardsArray.push(board);
        this.boardsObject[dataFileName] = board;
    },

    linkExits() {
        let board,
            row,
            rowLen,
            col,
            colLen,
            exit;

        // TODO: refactor to use forEach
        // For each board.
        for (let i = 0, boardsLen = this.boardsArray.length; i < boardsLen; i += 1) {
            board = this.boardsArray[i];
            // For each row in the board grid.
            for (row = 0, rowLen = board.grid.length; row < rowLen; row += 1) {
                // For each column in that row.
                for (col = 0, colLen = board.grid[row].length; col < colLen; col += 1) {
                    // Check if the static is an exit.
                    if (board.grid[row][col].static instanceof Exit) {
                        exit = board.grid[row][col].static;
                        // If the target for this exit isn't valid (might have been removed from the map), then destroy this exit.
                        if (this.boardsObject[exit.targetBoard] === undefined) {
                            exit.destroy();
                            continue;
                        }
                        if (this.boardsObject[exit.targetBoard].entrances[exit.targetEntrance] === undefined) {
                            exit.destroy();
                            continue;
                        }
                        // Currently, the exits have the string name of the board and entrance they should
                        // use in place of the actual objects, which are now used to set the actual objects.
                        exit.targetBoard = this.boardsObject[exit.targetBoard];
                        exit.targetEntrance = exit.targetBoard.entrances[exit.targetEntrance];
                    }
                }
            }
        }
    },

    linkDungeonManagerEvictionBoards() {
        Object.values(DungeonManagersList.ByID).forEach((dungeonManager) => {
            const evictionBoard = BoardsList.boardsObject[dungeonManager.evictionBoard];
            if (!evictionBoard) {
                Utils.error(`Cannot link dungeon manager eviction board for "${dungeonManager.name}".\nA board does not exist of given name: ${dungeonManager.evictionBoard}`);
            }
            dungeonManager.evictionBoard = evictionBoard;

            const evictionEntrance = evictionBoard.entrances[dungeonManager.evictionEntrance];
            if (!evictionEntrance) {
                Utils.error(`Cannot link dungeon manager eviction entrance for "${dungeonManager.name}".\nAn entrance on the eviction board does not exist of given name: ${dungeonManager.evictionEntrance}`);
            }
            dungeonManager.evictionEntrance = evictionEntrance;
        });
    },

    /**
     * Add a player entity to the game world from an existing player account.
     * @param {Object} clientSocket
     * @param {AccountModel} account
     */
    addExistingPlayer(clientSocket, account) {

        Utils.message("World add existing player:", account.displayName);

        if (clientSocket.entity !== undefined) {
            // Weird bug... :S
            Utils.warning("* * * * * adding existing player, but client socket already has an entity");
        }

        // Don't let too many players in the world.
        if (world.playerCount < world.maxPlayers) {
            // Start them in the overworld if they have played before.
            const randomPosition = world.boardsObject['overworld'].entrances['city-spawn'].getRandomPosition();

            /** @type {Player} */
            const playerEntity = new EntitiesList.Player({
                row: randomPosition.row,
                col: randomPosition.col,
                board: world.boardsObject["overworld"],
                displayName: account.displayName,
                socket: clientSocket,
            });

            AccountManager.loadPlayerData(playerEntity, account);

            const dataToSend = {};

            // Add the extra properties for the loaded data.
            dataToSend.isLoggedIn = true;
            dataToSend.inventory = playerEntity.getEmittableInventory();
            dataToSend.bankItems = playerEntity.bankAccount.getEmittableItems();
            dataToSend.boardName = playerEntity.board.name;
            dataToSend.boardAlwaysNight = playerEntity.board.alwaysNight;
            dataToSend.dayPhase = playerEntity.board.dayPhase;
            dataToSend.player = {
                id: playerEntity.id,
                row: playerEntity.row,
                col: playerEntity.col,
                displayName: playerEntity.displayName,
                maxHitPoints: playerEntity.maxHitPoints,
                maxEnergy: playerEntity.maxEnergy,
                glory: playerEntity.glory,
                stats: playerEntity.stats.getEmittableStats(),
                tasks: playerEntity.tasks.getEmittableTasks(),
            };
            // Get the things this player can see.
            dataToSend.dynamicsData = playerEntity.board.getNearbyDynamicsData(playerEntity.row, playerEntity.col);

            // Tell the nearby players to add this new player, after they are full set up (if an account was loaded, the properties will have been modified after object creation).
            playerEntity.emitToNearbyPlayers();

            clientSocket.sendEvent(EventsList.join_world_success, dataToSend);

            clientSocket.inGame = true;

            world.playerCount += 1;
        }
        else {
            clientSocket.sendEvent(EventsList.world_full);
        }

        console.log("  * Player count:", this.playerCount);
    },

    /**
     * Add a new player entity to the game world, without an associated player account.
     * They can create an account to associate with later.
     * @param {Object} clientSocket
     * @param {String} displayName
     */
    addNewPlayer(clientSocket, displayName) {

        if (clientSocket.entity !== undefined) {
            // Weird bug... :S
            Utils.warning("* * * * adding new player, but client socket already has an entity");
        }

        Utils.message("World add new player:", displayName);

        // Don't let too many players in the world.
        if (world.playerCount < world.maxPlayers) {

            const randomPosition = world.boardsObject['tutorial'].entrances['spawn'].getRandomPosition();

            /** @type {Player} */
            const playerEntity = new EntitiesList.Player({
                row: randomPosition.row,
                col: randomPosition.col,
                board: world.boardsObject["tutorial"],
                displayName: displayName,
                socket: clientSocket
            });

            // Give the new player some starting tasks, as they are NOT added automatically for player entities.
            playerEntity.tasks.addStartingTasks();
            // New accounts get some free stuff in their bank in the tutorial, so add those properties.
            playerEntity.bankAccount.addStarterItems();

            const dataToSend = {};

            dataToSend.inventory = playerEntity.getEmittableInventory();
            dataToSend.bankItems = playerEntity.bankAccount.getEmittableItems();
            dataToSend.boardName = playerEntity.board.name;
            dataToSend.boardAlwaysNight = playerEntity.board.alwaysNight;
            dataToSend.dayPhase = playerEntity.board.dayPhase;
            dataToSend.player = {
                id: playerEntity.id,
                row: playerEntity.row,
                col: playerEntity.col,
                displayName: playerEntity.displayName,
                maxHitPoints: playerEntity.maxHitPoints,
                maxEnergy: playerEntity.maxEnergy,
                glory: playerEntity.glory,
                stats: playerEntity.stats.getEmittableStats(),
                tasks: playerEntity.tasks.getEmittableTasks(),
            };
            // Get the things this player can see.
            dataToSend.dynamicsData = playerEntity.board.getNearbyDynamicsData(playerEntity.row, playerEntity.col);

            // Tell the nearby players to add this new player, after they are full set up (if an account was loaded, the properties will have been modified after object creation).
            playerEntity.emitToNearbyPlayers();

            clientSocket.sendEvent(EventsList.join_world_success, dataToSend);

            clientSocket.inGame = true;

            world.playerCount += 1;
        }
        else {
            clientSocket.sendEvent(EventsList.world_full);
        }

        console.log("  * Player count:", this.playerCount);
    },

    /**
     * Remove the given player from the world and the game.
     * @param {Object} clientSocket - The socket of the player entity to remove.
     */
    removePlayer(clientSocket) {
        console.log("remove player, account username:", clientSocket.accountUsername);
        // If the socket had an entity, remove it from the game.
        if (clientSocket.entity !== undefined) {
            // If they have an account username then they have an account, so log them out.
            if (clientSocket.accountUsername) {
                AccountManager.logOut(clientSocket);
            }

            clientSocket.entity.remove();
            // Remove the reference to the player entity.
            delete clientSocket.entity;
        }
        clientSocket.inGame = false;
        // Reduce the player count.
        this.playerCount -= 1;

        Utils.message("World remove player, player count:", this.playerCount);
    },

    /**
     * Move the game day phase along one phase.
     */
    progressTime() {
        // Shuffle the time along to the next period.
        dayPhaseCycle.push(dayPhaseCycle.shift());

        //Utils.message("Day phase progressed:", dayPhaseCycle[0]);

        // Check if the period is different than last. Don't bother updating the boards/players if it is the same. i.e. day and night last more than one phase.
        if (dayPhaseCycle[0] !== world.dayPhase) {
            // Get whatever is at the front.
            world.dayPhase = dayPhaseCycle[0];

            for (let i = 0, len = BoardsList.boardsArray.length; i < len; i += 1) {
                // Don't change the time inside dungeons and caves etc. They are always dark (night).
                if (BoardsList.boardsArray[i].alwaysNight === false) {
                    BoardsList.boardsArray[i].dayPhase = world.dayPhase;
                }
            }

            // Tell the boards and everyone on them the time has changed.
            wss.broadcastToInGame(EventsList.change_day_phase, world.dayPhase);
        }

        setTimeout(world.progressTime, dayPhaseRate);
    }

};

module.exports = world;

// Import these AFTER the world is exported.
const Board = require('./board/Board');
const EntitiesList = require('./EntitiesList');
const Exit = require('./entities/statics/interactables/exits/Exit');