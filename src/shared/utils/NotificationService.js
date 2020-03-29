import { Environment } from '../constants/constants';

export default class NotificationService {
    constructor() {
        this.domain = Environment.CHAT_DOMAIN;
        this.notificationHandlers = [];
        this.onInitialized = [];
    }

    init(userId) {
        throw new Error('Missing implementation');

        // if (!this.socket && userId) {
        //     store.dispatch(actions.fetchingNotifications());

        //     console.log('connecting to: ', Environment.CHAT_DOMAIN + '?userId=' + userId);

        //     this.socket = io(Environment.CHAT_DOMAIN + '?userId=' + userId);

        //     this.socket.on('initialize notifications', (notifications) => {
        //         store.dispatch(actions.fetchedNotifications(notifications));
        //         this.onInitialized.reduce((_, fn) => {
        //             return fn();
        //         }, 0);
        //     });

        //     this.socket.on('new notification', (notification) => {
        //         store.dispatch(actions.newNotification(notification));
        //         this.notificationHandlers.reduce((acc, fn) => {
        //             return fn(notification);
        //         }, 0);
        //     });
        // }
    }

    // addNotificationHandler = (handler) => {
    //     this.notificationHandlers.push(handler);
    // };

    // // Not mutation safe
    // removeNotificationHandler = (handler) => {
    //     const idx = this.notificationHandlers.indexOf(handler);
    //     this.notificationHandlers.splice(idx, 1);
    // };

    // reset = () => {
    //     this.notificationHandlers = [];
    // };

    // getChatStatus = () => {
    //     return new Promise((resolve, reject) => {
    //         const chatFetcher = () => {
    //             this.socket.emit('get chat status', (response) => {
    //                 if (response.error) {
    //                     return reject(response);
    //                 }
    //                 return resolve(response);
    //             });
    //         };
    //         if (this.socket) {
    //             chatFetcher();
    //         } else {
    //             this.onInitialized.push(chatFetcher);
    //         }
    //     });
    // };
}

// Singleton pattern
export const notificationService = new NotificationService();
