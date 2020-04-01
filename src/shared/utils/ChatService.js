import io from 'socket.io-client';

export default class ChatService {
    constructor(chatId, token, senderId, domain) {
        console.log('connecting to: ', domain + '?room=' + chatId);
        this.domain = domain;
        this.chatId = chatId;
        this.token = token;
        this.senderId = senderId;
    }

    init({ showPersonalInformation }) {
        const url =
            this.domain +
            '?room=' +
            this.chatId +
            '&token=' +
            this.token +
            (showPersonalInformation ? '&showPersonalInformation=true' : '');

        this.socket = io(url, {});

        this.socket.on('new message', (message) => {
            console.log('new message');
            !!this.onNewMessage && this.onNewMessage(message);
            this.readMessages();
        });
        this.socket.on('started typing', () => {
            !!this.receiverStartedTyping && this.receiverStartedTyping();
        });
        this.socket.on('stopped typing', () => {
            !!this.receiverStoppedTyping && this.receiverStoppedTyping();
        });
        this.socket.on('messages read', () => {
            console.log('on messages read');
            !!this.receiverReadMessages && this.receiverReadMessages();
        });

        return new Promise((resolve, reject) => {
            this.socket.on('initialize chat', (data) => {
                console.log('initialize chat');
                resolve(data);
                this.readMessages();
            });
        });
    }

    sendMessage(message) {
        return new Promise((resolve, reject) => {
            this.socket.emit('send message', message, (response) => {
                if (response.error) {
                    return reject(response);
                }
                return resolve(response);
            });
        });
    }

    dispose() {
        console.log('Disposing');
        return this.socket.close();
    }

    startedTyping = () => {
        this.socket.emit('started typing');
    };
    stoppedTyping = () => {
        this.socket.emit('stopped typing');
    };

    readMessages = () => {
        this.socket.emit('messages read', this.senderId);
    };
}
