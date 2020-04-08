import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useServerContext } from 'components/hooks/useServerContext';

export default class NotificationService {
    constructor() {
        this.notificationHandlers = [];
    }

    init = (userId, domain) => {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                this.socket = io(domain + '?userId=' + userId, {});
            }
            if (!userId) {
                return reject('No userId');
            }

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
            this.socket.close();
            this.socket = null;
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

export const useNotifications = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const { environment } = useServerContext();

    useEffect(() => {
        const connect = async () => {
            notificationService.init(userId, environment.CHAT_DOMAIN);
            const nn = await notificationService.getChatStatus();
            setNotifications(nn);
        };
        if (userId) {
            connect();
            return () => {
                notificationService.dispose();
            };
        }
    }, [userId, environment]);

    const clearNotifications = () => setNotifications([]);

    return [notifications, clearNotifications];
};

// Singleton pattern
export const notificationService = new NotificationService();
