import React, { useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { NavLink, useHistory, useLocation, Route } from 'react-router-dom';
import { Avatar, ClosePopupButton, Row, TeritaryButton, Col } from 'components/Blocks';
import { EVENT_GIGS } from 'routes/Event/gql';
import { gigStates } from 'constants/constants';
import Chat from 'components/common/Chat';
import { useAppState } from 'components/hooks/useAppState';
import { BodySmall } from 'components/Text';
import { ME } from 'components/gql';
import { useMyActiveGigs } from 'components/hooks/useMyActiveGigs';
import {
    ShadowWrapper,
    ExtraChatsLayover,
    ChatMessagesWrapper,
    FixedWrapper,
    ChatAvatarWrapper,
    ChatList,
    ChatBox,
    ChatHeader,
    ChatItem,
    NameBlock,
    NameBox,
    NewMessagesIndicator,
} from './blocks';
import ChatConfirmBeforeContact from './ChatConfirmBeforeContact';

const gigToChatConfig = ({
    isFromEvent,
    organizer,
    dj,
    eventId,
    eventHash,
    notifications,
    chatName,
}) => (gig) => {
    const theDj = {
        id: dj?.id,
        nickName: dj?.artistName,
        name: dj?.userMetadata.firstName,
        image:
            dj?.picture.path ||
            'https://cueup-staging.s3-ap-southeast-1.amazonaws.com/empty_profile_picture.png',
    };
    const theOrganizer = {
        id: organizer?.id,
        nickName: organizer?.artistName,
        name: organizer?.userMetadata.firstName,
        image:
            organizer?.picture.path ||
            'https://cueup-staging.s3-ap-southeast-1.amazonaws.com/empty_profile_picture.png',
    };

    let url;

    if (isFromEvent) {
        url = `/user/${dj?.permalink}/overview?gigId=${gig.id}&eventId=${eventId}&hash=${eventHash}`;
    } else {
        url = `/gig/${gig.id}/offer'`;
    }
    return {
        ...gig,
        showPersonalInformation:
            gig.showInfo || gig.status === gigStates.CONFIRMED || dj?.appMetadata?.isPro,
        declineOnContactInfo:
            !gig.showInfo && gig.status !== gigStates.CONFIRMED && !dj?.appMetadata?.isPro,
        chatId: gig.id,
        receiver: isFromEvent ? theDj : theOrganizer,
        sender: isFromEvent ? theOrganizer : theDj,
        hasMessage:
            notifications[gig.id] && notifications[gig.id].read < notifications[gig.id].total,
        eventId,
        url,
        isFromEvent,
        chatName,
    };
};

const SidebarChat = () => {
    const { notifications, activeChat, activeEvent, activeGig, setAppState } = useAppState();

    const setActiveChat = useCallback((chat) => setAppState({ activeChat: chat }), [setAppState]);

    if (activeEvent) {
        return (
            <SidebarChatOrganizer
                notifications={notifications}
                activeChat={activeChat}
                activeEvent={activeEvent}
                setAppState={setAppState}
                setActiveChat={setActiveChat}
            />
        );
    }

    return (
        <SidebarChatDj
            notifications={notifications}
            activeChat={activeChat}
            activeGig={activeGig}
            setActiveChat={setActiveChat}
        />
    );
};

const SidebarChatDj = ({ activeChat, notifications, activeGig, setActiveChat }) => {
    const { data } = useQuery(ME);

    const { gigs } = useMyActiveGigs();

    if (!data?.me) {
        return null;
    }

    const renderGigs = gigs.filter((g) => g.chatInitiated);

    if (activeGig && !renderGigs.some((g) => g.id === activeGig?.id)) {
        renderGigs.push(activeGig);
    }
    const chats = renderGigs.map((gig) =>
        gigToChatConfig({
            notifications,
            organizer: gig?.event?.organizer,
            eventId: gig?.event?.id,
            eventHash: gig?.event?.hash,
            dj: data?.me,
            chatName: gig?.event?.name,
        })(gig)
    );

    if (!chats?.length) {
        return null;
    }

    return <InnerContent chats={chats} setActiveChat={setActiveChat} activeChat={activeChat} />;
};

const SidebarChatOrganizer = ({ notifications, activeChat, activeEvent, setActiveChat }) => {
    const initialized = useRef(false);

    const { data } = useQuery(EVENT_GIGS, {
        skip: !activeEvent?.id,
        variables: {
            id: activeEvent?.id,
            hash: activeEvent?.hash,
        },
    });

    const chats = data?.event?.gigs
        .filter((g) => !!g.lastChatMessage || notifications[g.id] || activeChat === g.id)
        .map((g) =>
            gigToChatConfig({
                notifications,
                organizer: activeEvent.organizer,
                dj: g.dj,
                isFromEvent: true,
                eventId: activeEvent?.id,
                eventHash: activeEvent?.hash,
            })(g)
        );

    // open the latest chat
    useEffect(() => {
        if (!initialized.current && chats) {
            const toBeActivated = chats.reduce(
                (latestChat, chat) => {
                    if (
                        chat.lastChatMessage &&
                        new Date(latestChat.lastChatMessage.date) <
                            new Date(chat.lastChatMessage.date)
                    ) {
                        return chat;
                    }
                    return latestChat;
                },
                { lastChatMessage: { date: new Date(0) } }
            );

            if (toBeActivated?.id) {
                setActiveChat(toBeActivated.id);
                initialized.current = true;
            }
        }
    }, [activeChat, setActiveChat, chats]);

    if (!activeEvent || !chats) {
        return null;
    }

    return (
        <InnerContent
            chats={chats}
            event={activeEvent}
            setActiveChat={setActiveChat}
            activeChat={activeChat}
        />
    );
};

const InnerContent = ({ chats = [], event, activeChat, setActiveChat }) => {
    const doesOverflow = chats.length > 7;
    const activeChats = chats.slice(0, doesOverflow ? 6 : 7);
    const remainingChats = chats.slice(6);
    const chat = chats.find((c) => c.id === activeChat);

    return (
        <FixedWrapper>
            {chat && <ChatWrapper chat={chat} onClose={() => setActiveChat(null)} />}
            <ChatList>
                {activeChats.map((c) => (
                    <ChatBubble
                        active={c.id === activeChat}
                        key={c.id}
                        onClick={() => setActiveChat(c.id)}
                        {...c}
                    />
                ))}

                {doesOverflow && (
                    <ExtraChats
                        setActiveChat={setActiveChat}
                        chats={remainingChats}
                        active={remainingChats.some((c) => c.id === activeChat)}
                    />
                )}
            </ChatList>
            {!!event && (
                <Route
                    path="*/chat-confirm-first"
                    render={() => <ChatConfirmBeforeContact event={event} gigId={activeChat.id} />}
                />
            )}
        </FixedWrapper>
    );
};

const ExtraChats = ({ chats, active, setActiveChat }) => {
    const hasMessage = chats.some((c) => c.hasMessage);

    return (
        <ChatItem className={active ? 'active' : ''}>
            <ChatAvatarWrapper>
                <ShadowWrapper>
                    <img src={chats[0].receiver.image} />
                    <ExtraChatsLayover>+ {chats.length}</ExtraChatsLayover>
                </ShadowWrapper>
                {hasMessage && <NewMessagesIndicator />}
            </ChatAvatarWrapper>

            <NameBox style={{ top: '100%', transform: 'translate(-100%, -100%)' }}>
                {chats.map((c) => (
                    <TeritaryButton
                        key={c.id}
                        style={{
                            height: '30px',
                            textAlign: 'left',
                        }}
                        onClick={() => setActiveChat(c.id)}
                    >
                        <NameBlock>
                            {c.chatName} - {c.receiver.nickeName || c.receiver.name}
                        </NameBlock>
                        {c.hasMessage && <NewMessagesIndicator style={{ left: -2, top: 6 }} />}
                    </TeritaryButton>
                ))}
            </NameBox>
        </ChatItem>
    );
};

const ChatBubble = ({ receiver, onClick, active, chatName, hasMessage }) => {
    return (
        <ChatItem onClick={onClick} className={active ? 'active' : ''}>
            <ChatAvatarWrapper>
                <ShadowWrapper>
                    <img src={receiver.image} />
                </ShadowWrapper>
                {hasMessage && <NewMessagesIndicator />}
            </ChatAvatarWrapper>

            {!active && (
                <NameBox>
                    {chatName ? (
                        <NameBlock>
                            {chatName}
                            {<span>{receiver.nickName || receiver.name}</span>}
                        </NameBlock>
                    ) : (
                        <NameBlock>
                            {receiver.nickName || receiver.name}
                            {receiver.nickName && <span>{receiver.name}</span>}
                        </NameBlock>
                    )}
                </NameBox>
            )}
        </ChatItem>
    );
};

const ChatWrapper = ({ chat, onClose }) => {
    const { receiver, chatId, url, isFromEvent, chatName } = chat;
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        return () => {
            document.body.style.overflowY = '';
        };
    }, []);

    const handleMessageError = useCallback(
        (error) => {
            if (error.status === 403) {
                // forbidden / trying to send contact info
                const currentPath = location.pathname === '/' ? '' : location.pathname;

                const newPath = isFromEvent ? '/chat-confirm-first' : '/chat-get-pro';
                history.push(currentPath.replaceAll(newPath, '') + newPath);
            }
        },
        [history, location, isFromEvent]
    );

    const navigateToOffer = useCallback(() => {
        history.push(`/gig/${chat.id}/offer`);
        onClose();
    }, [chat, onClose, history]);
    const showDecline = useCallback(() => history.push(`/gig/${chat.id}/decline`), [chat, history]);

    const systemMessages = isFromEvent
        ? []
        : [getSystemMessage({ gig: chat, navigateToOffer, showDecline })];

    return (
        <ChatBox
            onMouseEnter={() => (document.body.style.overflowY = 'hidden')}
            onMouseLeave={() => (document.body.style.overflowY = '')}
        >
            <ChatHeader>
                <Col style={{ width: '100%' }}>
                    <Row between>
                        <NavLink to={url}>
                            <TeritaryButton
                                isWrapper
                                title={isFromEvent ? `See ${receiver.name}'s profile` : 'Go to gig'}
                            >
                                <Row middle>
                                    <Avatar
                                        small
                                        src={receiver.image}
                                        style={{ zIndex: 1, marginRight: '8px' }}
                                    />
                                    {chatName ? (
                                        <NameBlock>
                                            {chatName}
                                            {<span>{receiver.nickName || receiver.name}</span>}
                                        </NameBlock>
                                    ) : (
                                        <NameBlock>
                                            {receiver.nickName || receiver.name}
                                            {receiver.nickName && <span>{receiver.name}</span>}
                                        </NameBlock>
                                    )}
                                </Row>
                            </TeritaryButton>
                        </NavLink>

                        <ClosePopupButton small onClick={onClose} />
                    </Row>
                    {isFromEvent ? (
                        <a
                            href={'https://cueup.zendesk.com/hc/en-us/articles/360017164300'}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <BodySmall
                                style={{
                                    fontSize: 14,
                                    marginTop: 3,
                                    marginLeft: 6,
                                    textDecoration: 'underline',
                                }}
                            >
                                You have money-back guarantee when confirming the booking through
                                Cueup.
                            </BodySmall>
                        </a>
                    ) : (
                        <a
                            href={'https://cueup.zendesk.com/hc/en-us/articles/360017431939'}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <BodySmall
                                style={{
                                    fontSize: 14,
                                    marginTop: 3,
                                    marginLeft: 6,
                                    textDecoration: 'underline',
                                }}
                            >
                                Complete the booking through Cueup to get a better rank and get more
                                gigs.
                            </BodySmall>
                        </a>
                    )}
                </Col>
            </ChatHeader>
            <div style={{ flex: 1 }} />
            <ChatMessagesWrapper>
                <Chat
                    handleMessageError={handleMessageError}
                    key={chat.id}
                    {...chat}
                    systemMessages={systemMessages}
                    placeholder={<EmptyChat receiver={receiver} />}
                />
            </ChatMessagesWrapper>
        </ChatBox>
    );
};

const EmptyChat = ({ receiver }) => {
    return (
        <Col center middle style={{ height: '100%', textAlign: 'center' }}>
            <BodySmall style={{ marginBottom: '0.5em' }}>
                Ask {receiver.name} about anything.
            </BodySmall>
            <BodySmall>Contact details will be visible after booking confirmation.</BodySmall>
        </Col>
    );
};

const getSystemMessage = ({ gig, showDecline, navigateToOffer }) => {
    if (!gig) {
        return null;
    }
    const { status, referred } = gig;

    if (referred && status === gigStates.REQUESTED) {
        return {
            systemMessage: true,
            createdAt: new Date(),
            content:
                'The organizer is waiting on your offer. \nThis is a direct booking from your profile.',
            actions: [
                {
                    label: 'Decline gig',
                    action: showDecline,
                },
                {
                    label: 'Make offer',
                    action: navigateToOffer,
                },
            ],
        };
    }

    const messages = {
        [gigStates.REQUESTED]: {
            systemMessage: true,
            createdAt: new Date(),
            content:
                'The organizer is waiting on your offer. \nMake an offer quickly before someone else does. You can always update the offer later until the organizer has confirmed.',
            actions: [
                {
                    label: 'Decline gig',
                    action: showDecline,
                },
                {
                    label: 'Make offer',
                    action: navigateToOffer,
                },
            ],
        },
        [gigStates.ACCEPTED]: {
            systemMessage: true,
            createdAt: new Date(),
            content:
                'Waiting on confirmation from the organizer. \nYou can still update the offer if necessary.',
            actions: [
                {
                    label: 'Update offer',
                    action: navigateToOffer,
                },
            ],
        },
        [gigStates.CONFIRMED]: {
            systemMessage: true,
            createdAt: new Date(),
            content:
                'Whoop! The gig has been confirmed. \nMake sure that everything is agreed upon with the organizer, and get ready to play.',
            actions: [
                {
                    label: 'See details',
                    action: navigateToOffer,
                },
            ],
        },
        [gigStates.EVENT_CANCELLED]: {
            systemMessage: true,
            createdAt: new Date(),
            content: 'The event has been cancelled.',
        },
        [gigStates.FINISHED]: {
            systemMessage: true,
            createdAt: new Date(),
            content:
                'The gig is finished, we hope you had a good time. \nAsk the organizer to leave a review.',
        },
        [gigStates.LOST]: {
            systemMessage: true,
            createdAt: new Date(),
            content:
                'Another DJ will play this gig. \nTo increase your chances of getting gigs, make sure that your profile is complete with pictures, a good bio, mixtapes etc.',
        },
        [gigStates.DECLINED]: {
            systemMessage: true,
            createdAt: new Date(),
            content: 'You have declined this gig',
        },
        [gigStates.CANCELLED]: {
            systemMessage: true,
            createdAt: new Date(),
            content: 'You have cancelled this gig',
        },
        [gigStates.ORGANIZER_DECLINED]: {
            systemMessage: true,
            createdAt: new Date(),
            content:
                'Another DJ will play this gig. \nTo increase your chances of getting gigs, make sure that your profile is complete with pictures, a good bio, mixtapes etc.',
        },
    };

    return messages[status];
};

export default SidebarChat;
