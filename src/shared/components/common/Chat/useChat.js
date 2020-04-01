import { useRef, useEffect, useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import ChatService from '../../../utils/ChatService';
import { authService as auth } from '../../../utils/AuthService';

const useChat = ({ sender, receiver, id, showPersonalInformation, data }) => {
    const chat = useRef();
    const startedTyping = useRef();
    const stoppedTyping = useRef();
    const onNewContent = useRef();
    const [messages, setMessages] = useState([]);
    const [sending, setSending] = useState(false);
    const [ready, setReady] = useState(false);
    const [typing, setTyping] = useState(false);
    const [newMessage, setNewMessage] = useState();

    const senderId = sender.id;

    const addNewMessage = useCallback((message, sending = false, cb) => {
        setMessages((messages) => [
            ...messages,
            {
                ...message,
                createdAt: new Date(),
            },
        ]);
        setSending(sending);
        onNewContent.current && onNewContent.current(message);
    }, []);

    // initialize
    useEffect(() => {
        if (id && senderId) {
            chat.current = new ChatService(id, auth.getToken(), senderId);
            // chat.current.init({ showPersonalInformation }).then((messages) => {
            //     setMessages(messages);
            //     setReady(true);
            //     onNewContent.current && onNewContent.current();
            // });
            // return () => {
            //     chat.current.dispose();
            // };
        }
    }, [id, senderId, showPersonalInformation]);

    // setup listeners
    useEffect(() => {
        if (ready) {
            startedTyping.current = debounce(chat.current.startedTyping, 1000, {
                leading: true,
                trailing: false,
            });
            stoppedTyping.current = debounce(chat.current.stoppedTyping, 4000);

            const receiverReadMessages = () => {
                setMessages((messages) => [
                    ...messages.map((msg) => {
                        return { ...msg, read: true };
                    }),
                ]);
            };

            chat.current.receiverStoppedTyping = () => setTyping(false);
            chat.current.receiverStartedTyping = () => setTyping(true);
            chat.current.onNewMessage = addNewMessage;
            chat.current.receiverReadMessages = receiverReadMessages;
        }
    }, [addNewMessage, ready]);

    const sendMessage = (declineOnContactInfo = false) => {
        if (!newMessage || !newMessage.trim()) {
            return;
        }
        const message = {
            content: newMessage,
            to: receiver.id,
            room: String(id),
            from: sender.id,
            declineOnContactInfo,
            ...data,
        };

        // First set the message optimisticly
        addNewMessage(message, true);
        setNewMessage('');

        // Then send the message
        chat.current.sendMessage(message).then((_) => setSending(false));
    };

    const handleChange = (text) => {
        startedTyping.current();
        setNewMessage(text);
        stoppedTyping.current();
    };

    return {
        sending,
        ready,
        typing,
        messages,
        sendMessage,
        handleChange,
        newMessage,
        onNewContent,
    };
};

export default useChat;
