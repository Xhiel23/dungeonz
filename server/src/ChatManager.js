
const EventEmitter = require('events');
const EventsList = require('./EventsList');

class ChatGroup {
    constructor(){
        this.emitter = new EventEmitter();
    }

    emitMessage(message){
        this.emitter.emit('chat', {message: message});
    }

    subscribe(socket) {
        this.emitter.on('chat', (config) => {
            socket.sendEvent(EventsList.chat, config);
        });
    }
}

const chatManager = {

    init() {
        this.createGroup({groupName: "Nearby"});
        this.createGroup({groupName: "Overworld"});
        this.createGroup({groupName: "Trade"});
        this.createGroup({groupName: "Events"});
    },

    groups: {},

    /**
     * 
     * @param {*} config 
     * @param {String} config.groupName
     * @param {String} config
     */
    createGroup(config) {
        this.groups[config.groupName] = ;
    },

    emitMessageToGroup( message) {

    }

    emitSystemMessageToGroup(message) {

    }


}