import io from 'socket.io-client';

export default class NotificationService {
    constructor() {
        this.notificationHandlers = [];
    }

    init = (userId, domain) => {
        return new Promise((resolve, reject) => {
            if (this.socket) {
                return reject('Already initialized');
            }
            if (!userId) {
                return reject('No userId');
            }
            console.log('connecting to: ', domain + '?userId=' + userId);

            this.socket = io(domain + '?userId=' + userId, {});

            this.socket.on('initialize notifications', (notifications) => {
                resolve(notifications);
            });

            this.socket.on('new notification', (notification) => {
                this.notificationHandlers.reduce((acc, fn) => {
                    return fn(notification);
                }, 0);
            });
        });
    };

    addNotificationHandler = (handler) => {
        this.notificationHandlers.push(handler);
    };

    // Not mutation safe
    removeNotificationHandler = (handler) => {
        const idx = this.notificationHandlers.indexOf(handler);
        this.notificationHandlers.splice(idx, 1);
    };

    reset = () => {
        this.notificationHandlers = [];
    };

    dispose = () => {
        console.log('Disposing');
        if (this.socket) {
            return this.socket.close();
        }
    };

    getChatStatus = () => {
        return new Promise((resolve, reject) => {
            const chatFetcher = () => {
                this.socket.emit('get chat status', (response) => {
                    if (response.error) {
                        return reject(response);
                    }
                    return resolve(response);
                });
            };
            if (this.socket) {
                chatFetcher();
            } else {
                this.onInitializedHandlers.push(chatFetcher);
            }
        });
    };
}

// Singleton pattern
export const notificationService = new NotificationService();
