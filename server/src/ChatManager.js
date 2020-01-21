const EventsList = require('./EventsList');

class ChatSubscription {
    constructor (channel, subscriber) {
        this.channelName = channel.name;
        this.lastMessageTime = 0;
        this.subscriber = subscriber;
    }
}

class ChatSubscriber {
    constructor(socket){
        this.socket = socket;
        this.subscriptions = [];
    }
}

class ChatChannel {
    constructor(config){
        this.name = config.name;
        this.startMessage = config.startMessage || "";
        this._subscriptions = {};
        this.rateLimit = config.rateLimit || 1000;
    }

    emitMessage(socket, message){
        const subscription = this._subscriptions[no socket.id prop :s];

        // Check if this user is allowed to message again to this channel.
        if(Date.now() + this.rateLimit > subscription.lastMessageTime){
            // Send the chat message to all of this channels subscribers.
            Object.entries(this._subscribers).forEach((socket) => {
                socket.sendEvent(EventsList.chat, {name: this.name, message});
            });

            // Update the time they sent their most recent message.
            subscription.lastMessageTime = Date.now();
        }
        // Too soon since the last time they sent a message to this channel.
        else {
            const secondsRemaining = (Date.now() - subscription.lastMessageTime) / 1000;
            socket.sendEvent(EventsList.chat, {message: "You must wait " + secondsRemaining + " until you can message in this channel again."})
        }
        
    }

    addSubscriber(subscriber) {
        // Send them the start message.
        subscriber.socket.sendEvent(EventsList.chat, {name: this.name, message: this.startMessage});

        console.log("add subscriber, socket id:", subscriber.no socket.id prop :s);

        this._subscriptions[subscriber.no socket.id prop :s] = new ChatSubscription(this, subscriber);
    }

    removeSubscriber(socket) {
        console.log("remove subscriber, socket id:", no socket.id prop :s);
        this._subscriptions[no socket.id prop :s].channelName = null;
        delete this._subscriptions[no socket.id prop :s];

    }

}

const chatManager = {
    
    /**
     * @type {Object.<ChatChannel>}
     */
    _channels: {},

    _subscribers: {},

    init() {
        this.createChannel({channelName: "Nearby", startMessage: "Chat with nearby players."});
        this.createChannel({channelName: "Overworld", startMessage: "Chat with all players on the overworld."});
        this.createChannel({channelName: "Trade", startMessage: "Offer to buy and sell items", rateLimit: 10000});
        this.createChannel({channelName: "Events", startMessage: "Advertise events"});
    },

    addSubscriberToDefaultChannels(socket) {
        ["Nearby", "Overworld", "Trade", "Events"].forEach((channelName) => {
            this.addSubscriber(channelName, socket)
            //this._channels[channelName].addSubscriber(socket);
        });
    },

    removeSubscriberFromAllChannels(socket) {
        const subscriber = this._subscribers[no socket.id prop :s];
        if(subscriber){
            subscriber;
        }
    },

    addSubscriber(channelName, socket) {
        console.log("adding subscriber:", socket.entity.displayName, ", to:", channelName);
        const channel = this._channels[channelName];
        if(channel){
            const subscriber = this._subscribers[no socket.id prop :s];
            if(subscriber === undefined){
                subscriber = new ChatSubscriber(socket);
            }

            channel.addSubscriber(subscriber);
        }
    },

    removeSubscriber(channelName, socket) {
        const channel = this._channels[channelName];
        if(channel){
            const subscriber = this._subscribers[no socket.id prop :s];
            channel.removeSubscriber(subscriber);
        }
    },

    /**
     * 
     * @param {Object} config
     * @param {String} config.channelName
     * @param {String} config
     */
    createChannel(config) {
        this._channels[config.channelName] = new ChatChannel(config);
    },

    emitMessageToChannel(channelName, message) {
        this._channels[channelName].emitMessage(message);
    },

    emitSystemMessageToChannel(message) {

    }

}
module.exports = chatManager