import React, { useRef, useEffect } from 'react';
import moment from 'moment-timezone';
import { Icon } from '@iconify/react';
import sendIcon from '@iconify/icons-ion/send';

import TextareaAutosize from 'react-autosize-textarea';
import usePushNotifications from 'components/hooks/usePushNotifications';
import { BodySmall } from 'components/Text';
import { LoadingPlaceholder2 } from '../LoadingPlaceholder';
import { Avatar } from '../../Blocks';
import useChat from './useChat';

import './index.css';

const Chat = ({
    sender,
    showPersonalInformation,
    receiver,
    placeholder,
    hideComposer,
    chat,
    systemMessages,
}) => {
    const messagesContainer = useRef();

    const { typing, messages, ready } = chat;

    useEffect(() => {
        const scrollToBottom = () => {
            if (messagesContainer.current) {
                console.log('scrolling');
                messagesContainer.current.scrollTop = 99999999;
            }
        };

        scrollToBottom();
    }, [messages]);

    const dateSorter = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);
    const allMessages = systemMessages
        ? [...messages, ...systemMessages].sort(dateSorter)
        : messages;
    const datedMessages = Object.entries(toDateGroups(allMessages));

    return (
        <div className="chat">
            <div ref={messagesContainer} className="messages">
                <div style={{ flex: 1 }}> </div>

                {!ready ? <LoadingPlaceholder2 /> : messages.length > 0 ? null : placeholder}
                {datedMessages.map(([time, messages], idx) => (
                    <DateGroup
                        key={time}
                        messages={messages}
                        time={time}
                        sender={sender}
                        receiver={receiver}
                        showPersonalInformation={showPersonalInformation}
                        isLastDateGroup={datedMessages.length === idx + 1}
                    />
                ))}

                {typing ? (
                    <div className="message received">
                        <Avatar className="avatar" alt={'receiver'} src={receiver.image} />
                        <div className="speech-bubble typing-indicator">
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                ) : null}
            </div>
            {!hideComposer && (
                <MessageComposer autoFocus chat={chat} placeholder={'Message ' + receiver.name} />
            )}
        </div>
    );
};

export const MessageComposer = ({ chat, placeholder, autoFocus }) => (
    <form onSubmit={chat.sendMessage} className="message-composer">
        <div className="input-wrapper">
            <TextareaAutosize
                autoFocus
                rows={1}
                maxRows={5}
                placeholder={placeholder}
                className="message-input"
                name="chat-input"
                value={chat.newMessage}
                onChange={(e) => {
                    chat.handleChange(e.target.value);
                }}
                onKeyPress={(event) => {
                    if (event.which === 13 && !event.shiftKey && !event.altKey) {
                        event.preventDefault();
                        chat.sendMessage();
                    }
                }}
            />
        </div>
        <button
            onClick={(event) => {
                event.preventDefault();
                chat.sendMessage();
            }}
            disabled={chat.sending}
            type="submit"
        >
            <Icon color="#03d1ff" icon={sendIcon} style={{ fontSize: '28px' }} />
        </button>
    </form>
);

const enrichMessages = ({ sender, receiver, messages }) => {
    return messages.map((msg, idx) => ({
        ...msg,
        isOwn: msg.from === sender.id,
        isLastInGroup: idx + 1 === messages.length,
        isFirstInGroup: idx === 0,
        image: msg.from === sender.id ? sender.image : receiver.image,
    }));
};

const toDateGroups = (messages) => {
    let prevDate = new Date(0);
    let currentKey = null;
    return messages.reduce((dateGroups, msg) => {
        if (!msg) {
            return dateGroups;
        }
        const msgDate = new Date(msg.createdAt);
        const insertDate = Math.floor((msgDate - prevDate) / 1000 / 60) > 60;

        prevDate = msgDate;

        if (insertDate) {
            currentKey = msgDate.getTime();
            return {
                ...dateGroups,
                [currentKey]: [msg],
            };
        }
        return {
            ...dateGroups,
            [currentKey]: [...dateGroups[currentKey], msg],
        };
    }, {});
};

const toSenderGroup = (messages) => {
    let currentSender = null;
    let currentGroupKey = 0;

    return messages.reduce((senderGroups, msg) => {
        const isNewGroup = currentSender !== msg.from;
        currentSender = msg.from;

        if (isNewGroup) {
            currentGroupKey += 1;
            return {
                ...senderGroups,
                [currentGroupKey]: [msg],
            };
        }
        return {
            ...senderGroups,
            [currentGroupKey]: [...senderGroups[currentGroupKey], msg],
        };
    }, {});
};

const DateGroup = ({
    messages,
    isLastDateGroup,
    time,
    sender,
    receiver,
    showPersonalInformation,
}) => {
    const date = moment.unix(time / 1000);
    const isToday = moment().diff(date, 'days') === 0;
    const formatted = isToday ? date.format('LT') : date.format('LL');

    const groupedMessages = toSenderGroup(messages);
    const groups = Object.entries(groupedMessages);
    return (
        <div>
            <p className="messages-date">{formatted}</p>

            {groups.map(([senderId, messages], idx) => (
                <SenderGroup
                    key={time + '-' + idx}
                    messages={messages}
                    receiver={receiver}
                    sender={sender}
                    showPersonalInformation={showPersonalInformation}
                    isLastGroup={isLastDateGroup && groups.length === idx + 1}
                />
            ))}
        </div>
    );
};

const SenderGroup = ({ messages, isLastGroup, sender, receiver, showPersonalInformation }) => {
    const enrichedMessages = enrichMessages({ sender, receiver, messages });

    return (
        <div className={'sender-group '}>
            {enrichedMessages.map((m, idx) => (
                <Message
                    key={m._id || 'new-message' + idx}
                    {...m}
                    showPersonalInformation={showPersonalInformation}
                    nextMessage={enrichedMessages[idx + 1]}
                    isLast={isLastGroup && messages.length === idx + 1}
                />
            ))}
        </div>
    );
};

const Message = (props) => {
    const {
        content,
        isOwn,
        isLast,
        isFirstInGroup,
        isLastInGroup,
        actions,
        containsNumber,
        containsURL,
        containsEmail,
        showPersonalInformation,
        sending,
        image,
        systemMessage,
        nextMessage,
        metadata,
    } = props;

    const showNotice = containsEmail || containsNumber || containsURL;

    const cornerStyle = isOwn
        ? {
              borderTopLeftRadius: '20px',
              borderBottomLeftRadius: '20px',
              borderBottomRightRadius: isLastInGroup ? '20px' : '2px',
              borderTopRightRadius: isFirstInGroup ? '20px' : '2px',
          }
        : {
              borderTopRightRadius: '20px',
              borderBottomRightRadius: '20px',
              borderBottomLeftRadius: isLastInGroup ? '20px' : '2px',
              borderTopLeftRadius: isFirstInGroup ? '20px' : '2px',
          };

    return (
        <>
            <div className={`message-wrapper ${isOwn ? 'send' : 'received'}`}>
                <div className={`message ${isOwn ? 'send' : 'received'}`}>
                    {isLastInGroup && !isOwn && (
                        <Avatar
                            className="avatar"
                            alt={isOwn ? 'your picture' : 'receiver picture'}
                            src={systemMessage ? '/apple-touch-icon.png' : image}
                        />
                    )}
                    <div className={'speech-bubble'} style={cornerStyle}>
                        <div className="content">{content}</div>
                        {systemMessage && actions && (
                            <div className="message-actions">
                                {actions.map((a, idx) => (
                                    <button key={idx} onClick={a.action}>
                                        {a.label}
                                    </button>
                                ))}
                            </div>
                        )}
                        {metadata && showPersonalInformation && <UrlMetadata {...metadata} />}
                    </div>
                </div>
            </div>

            {!showPersonalInformation && showNotice && (
                <div className="message-info">Information visible after confirmation</div>
            )}
            {isLast && isOwn && <Status sending={sending} message={props} />}
            {systemMessage && !nextMessage?.systemMessage ? (
                <div className="message-info service-message">
                    This is a service message from Cueup.
                </div>
            ) : null}
        </>
    );
};

const UrlMetadata = ({ title, image, description, url }) => {
    return (
        <a
            target="_blank"
            rel="noopener noreferrer"
            href={url}
            style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f4f5f7',
                color: '#32325d',
                alignItems: 'center',
            }}
        >
            {image && (
                <img src={image} style={{ maxHeight: 106, width: '100%', objectFit: 'cover' }} />
            )}
            <div style={{ padding: 14, textAlign: 'left', width: '100%' }}>
                <b style={{ fontWeight: 500 }}>{title}</b>
                <BodySmall
                    style={{
                        'overflow': 'hidden',
                        'textOverflow': 'ellipsis',
                        'display': '-webkit-box',
                        'lineClamp': '2',
                        '-webkit-line-clamp': '2',
                        'webkitBoxOrient': 'vertical',
                        'maxHeight': '50px',
                    }}
                >
                    {description}
                </BodySmall>
            </div>
        </a>
    );
};

const Status = ({ sending, message }) => {
    const status = sending ? 'Sending' : message.read ? 'Seen' : 'Delivered';

    return (
        <div className="message-info">
            <span>
                {!sending ? (
                    <svg
                        width="12px"
                        height="11px"
                        viewBox="0 0 12 11"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g
                                id="checkmark"
                                transform="translate(0.000000, -1.000000)"
                                fill="#cad2dc"
                            >
                                <path
                                    d="M10.767,1.243 L3.65,8.53 L1.72,6.267 C0.878,5.537 -0.45,6.389 0.154,7.482 L2.444,11.447 C2.807,11.933 3.651,12.419 4.494,11.447 C4.857,10.961 11.731,2.337 11.731,2.337 C12.577,1.364 11.491,0.515 10.769,1.243 L10.767,1.243 Z"
                                    id="Shape"
                                />
                            </g>
                        </g>
                    </svg>
                ) : null}
                {status}
            </span>
        </div>
    );
};

const WithNotificationMessage = ({ systemMessages = [], ...props }) => {
    const { pushShouldBeEnabled, showPrompt, optOut } = usePushNotifications({
        userId: props?.sender.id,
    });

    let newSystemMessages = systemMessages;
    if (pushShouldBeEnabled) {
        newSystemMessages = [
            ...systemMessages,
            {
                systemMessage: true,
                createdAt: new Date(),
                content: 'Do you want to enable browser notifications when you get a new message?',
                actions: [
                    {
                        label: 'No thanks',
                        action: optOut,
                    },
                    {
                        label: 'Enable',
                        action: showPrompt,
                    },
                ],
            },
        ];
    }

    return <Chat {...props} systemMessages={newSystemMessages} />;
};

const WithChat = (props) => {
    const {
        sender,
        receiver,
        chatId,
        showPersonalInformation,
        eventId,
        declineOnContactInfo,
        handleMessageError,
    } = props;

    const chat = useChat({
        sender,
        receiver,
        id: chatId,
        declineOnContactInfo,
        showPersonalInformation,
        handleMessageError,
        data: {
            eventId,
        },
    });

    return <WithNotificationMessage {...props} chat={chat} />;
};

const Wrapper = (props) => {
    const { chat } = props;

    if (!chat) {
        return <WithChat {...props} />;
    }

    return <WithNotificationMessage {...props} />;
};

export default Wrapper;
