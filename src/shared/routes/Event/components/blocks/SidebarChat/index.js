import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-apollo';
import { NavLink } from 'react-router-dom';
import { Avatar, ClosePopupButton, Row, TeritaryButton } from 'components/Blocks';
import { EVENT_GIGS } from 'routes/Event/gql';
import { gigStates } from 'constants/constants';
import Chat from 'components/common/Chat';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes, userRoutes } from 'constants/locales/appRoutes';

const gigToChatConfig = ({ organizer, eventId, notifications }) => (gig) => ({
    ...gig,
    showPersonalInformation: gig.status === gigStates.CONFIRMED,
    chatId: gig.id,
    receiver: {
        id: gig.dj?.id,
        nickName: gig.dj?.artistName,
        name: gig.dj?.userMetadata.firstName,
        image: gig.dj?.picture.path,
        permalink: gig.dj?.permalink,
    },
    sender: {
        id: organizer.id,
        nickName: organizer.artistName,
        name: organizer.userMetadata.firstName,
        image: organizer.picture.path,
    },
    hasMessage: notifications[gig.id] && notifications[gig.id].read < notifications[gig.id].total,
    eventId,
});

const DataWrapper = ({ event, activeChat, setActiveChat, notifications }) => {
    const { data } = useQuery(EVENT_GIGS, {
        skip: !event?.id,
        variables: {
            id: event?.id,
            hash: event?.hash,
        },
    });

    if (!event) {
        return null;
    }

    const chats = data?.event?.gigs
        // .filter((g) => g.chatInitiated)
        .map(gigToChatConfig({ notifications, organizer: event.organizer, eventId: event?.id }));

    return (
        <SidebarChat
            chats={chats}
            event={event}
            setActiveChat={setActiveChat}
            activeChat={activeChat}
        />
    );
};

const SidebarChat = ({ chats = [], event, activeChat, setActiveChat }) => {
    const activeChats = chats.slice(0, 7);
    const chat = chats.find((c) => c.id === activeChat);

    return (
        <FixedWrapper>
            {chat && <ChatWrapper chat={chat} event={event} onClose={() => setActiveChat(null)} />}
            <ChatList>
                {activeChats.map((c) => (
                    <ChatBubble
                        active={c.id === activeChat}
                        key={c.id}
                        onClick={() => setActiveChat(c.id)}
                        {...c}
                    />
                ))}
            </ChatList>
        </FixedWrapper>
    );
};

const ChatBubble = ({ receiver, onClick, active, hasMessage }) => {
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
                    <NameBlock>
                        {receiver.nickName || receiver.name}
                        {receiver.nickName && <span>{receiver.name}</span>}
                    </NameBlock>
                </NameBox>
            )}
        </ChatItem>
    );
};

const ChatWrapper = ({ chat, event, onClose }) => {
    const { receiver, chatId } = chat;
    const { translate } = useTranslate();
    useEffect(() => {
        return () => {
            document.body.style.overflowY = '';
        };
    }, []);

    const pathname = `${translate(appRoutes.user)}/${receiver.permalink}/${userRoutes.overview}`;

    return (
        <ChatBox
            onMouseEnter={() => (document.body.style.overflowY = 'hidden')}
            onMouseLeave={() => (document.body.style.overflowY = '')}
        >
            <ChatHeader>
                <NavLink
                    to={{
                        pathname,
                        state: { gigId: chatId },
                        search: `?gigId=${chatId}&eventId=${event.id}&hash=${event.hash}`,
                    }}
                >
                    <TeritaryButton isWrapper title={`See ${receiver.name}'s profile`}>
                        <Row middle>
                            <Avatar
                                small
                                src={receiver.image}
                                style={{ zIndex: 1, marginRight: '8px' }}
                            />
                            <NameBlock>
                                {receiver.nickName || receiver.name}
                                {receiver.nickName && <span>{receiver.name}</span>}
                            </NameBlock>
                        </Row>
                    </TeritaryButton>
                </NavLink>
                <ClosePopupButton small onClick={onClose} />
            </ChatHeader>
            <div style={{ flex: 1 }} />
            <ChatMessagesWrapper>
                <Chat {...chat} />
            </ChatMessagesWrapper>
        </ChatBox>
    );
};

const NewMessagesIndicator = styled.div`
    border: 2px solid #ffffff;
    background-color: #fa383e;
    height: 16px;
    width: 16px;
    position: absolute;
    top: 0;
    right: 0;
    color: #fff;
    border-radius: 50%;
    font-size: 10px;
    text-align: center;
    line-height: 17px;
    font-weight: 500;
`;

const ChatMessagesWrapper = styled.div`
    height: 100%;
    button[type='submit'] {
        height: 32px;
        width: 32px;
        border-radius: 50%;
        margin-left: 4px;
        > svg {
            font-size: 24px !important;
        }
        &:hover {
            background-color: #f6f8f9;
        }
    }

    img {
        opacity: 1;
        z-index: 1 !important;
    }

    .messages {
        padding: 1em;
        padding-top: 60px;
        height: 409px;
    }
    .messages-date {
        font-size: 1em;
    }
    .message-composer {
        padding: 0.5em;
    }
`;

const NameBlock = styled.p`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
    font-size: 1em;
    line-height: 1.2em;
    max-width: 220px;
    > span {
        font-weight: 300;
        display: block;
    }
`;

const ChatHeader = styled.div`
    padding: 8px;
    display: flex;
    background: #fff;
    border-bottom: 1px solid #ebebeb;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    @supports (backdrop-filter: none) {
        background: rgba(255, 255, 255, 0.4);
        backdrop-filter: saturate(180%) blur(20px);
    }
`;

const ChatBox = styled.div`
    border-radius: 8px;
    background-color: #fff;
    height: 455px;
    width: 328px;
    overflow-y: hidden;
    max-height: calc(100vh - 60px - 24px);
    box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px;
    display: flex;
    flex-direction: column;
    position: relative;
`;

const NameBox = styled.div`
    display: none;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-100%, -50%);
    background-color: white;
    padding: 0.75em;
    border-radius: 8px;
    max-width: 250px;

    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(0, 0, 0, 0.2) 0px 12px 28px 0px;
`;

const FixedWrapper = styled.div`
    position: fixed;
    bottom: 70px;
    right: 0;
    z-index: 10;
    display: flex;
    align-items: flex-end;
`;

const ChatList = styled.ul`
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: flex-end;
    margin: 0;
`;

const ShadowWrapper = styled.div`
    transition-duration: 0.05s, 0.1s;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(0, 0, 0, 0.2) 0px 12px 28px 0px;
    height: 48px;
    width: 48px;
    border-radius: 50%;
`;

const ChatItem = styled.li`
    cursor: pointer;
    list-style: none;
    width: 90px;
    height: 58px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    &.active:before,
    :hover:before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        height: 1em;
        width: 1em;
        background-color: #fff;
        border-top-right-radius: 3px;
        z-index: 10;
    }
    &:hover {
        ${NameBox} {
            display: block;
        }
        ${ShadowWrapper} {
            box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 4px 0px, rgba(0, 0, 0, 0.2) 0px 16px 28px 0px;
        }
    }
`;

const ChatAvatarWrapper = styled.div`
    cursor: pointer;
    touch-action: manipulation;
    height: 48px;
    width: 48px;
    border-radius: 50%;

    position: relative;
    z-index: 0;
    background-color: white;

    img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
`;

export default DataWrapper;
