import { useEffect, useCallback, useRef } from 'react';
import { notificationService } from 'utils/NotificationService';
import { useServerContext } from './useServerContext';
import { useAppState } from './useAppState';

let masterService = false;

export const useNotifications = ({ userId }) => {
    const { notifications, setAppState, activeChat } = useAppState();
    const { environment } = useServerContext();
    const serviceRef = useRef();

    const setNotifications = useCallback(
        (funOrVal) => {
            setAppState((state) => {
                const notifications =
                    typeof funOrVal === 'function' ? funOrVal(state.notifications) : funOrVal;
                return {
                    ...state,
                    notifications,
                };
            });
        },
        [setAppState]
    );

    useEffect(() => {
        const connect = async () => {
            notificationService.init(userId, environment.CHAT_DOMAIN);
            serviceRef.current = await notificationService.getChatStatus();
            setNotifications(serviceRef.current);

            if (!masterService) {
                masterService = serviceRef.current;
            }
        };
        if (userId) {
            connect();
            return () => {
                notificationService.dispose();
                if (masterService === serviceRef.current) {
                    masterService = null;
                }
            };
        }
    }, [userId, environment, setNotifications]);

    const readRoom = useCallback(
        (id) => {
            if (masterService === serviceRef.current) {
                setNotifications((nn) => {
                    delete nn[id];
                    return { ...nn };
                });
            }
        },
        [setNotifications]
    );

    // handle the notification
    useEffect(() => {
        const handleNewNotification = (n) => {
            if (masterService === serviceRef.current) {
                setNotifications((nn) => {
                    let existing = nn[n.room];
                    if (existing) {
                        existing.total += 1;
                    } else {
                        existing = {
                            read: 0,
                            total: 1,
                        };
                    }

                    return {
                        ...nn,
                        [n.room]: existing,
                    };
                });
            }
        };
        notificationService.addNotificationHandler(handleNewNotification);

        return () => {
            notificationService.removeNotificationHandler(handleNewNotification);
        };
    }, [setNotifications]);

    useEffect(() => {
        const hasNoti = notifications[activeChat];
        if (activeChat && hasNoti) {
            readRoom(activeChat);
        }
    }, [readRoom, activeChat, notifications]);

    return [notifications, { readRoom }];
};
