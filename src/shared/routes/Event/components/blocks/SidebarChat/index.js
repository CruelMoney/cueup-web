import React, { useState } from 'react';
import styled from 'styled-components';
import { Avatar, ClosePopupButton, Row } from 'components/Blocks';

const mockedChats = [
    {
        id: 1,
        name: 'chris',
        thumb: 'https://cueup-staging.s3-ap-southeast-1.amazonaws.com/empty_profile_picture.png',
    },
    {
        id: 2,
        name: 'chris',
        thumb: 'https://cueup-staging.s3-ap-southeast-1.amazonaws.com/empty_profile_picture.png',
    },
    {
        id: 3,
        name: 'chris',
        thumb: 'https://cueup-staging.s3-ap-southeast-1.amazonaws.com/empty_profile_picture.png',
    },
    {
        id: 4,
        name: 'chris',
        thumb: 'https://cueup-staging.s3-ap-southeast-1.amazonaws.com/empty_profile_picture.png',
    },
    {
        id: 5,
        name: 'chris',
        thumb: 'https://cueup-staging.s3-ap-southeast-1.amazonaws.com/empty_profile_picture.png',
    },
    {
        id: 6,
        name: 'chris',
        thumb: 'https://cueup-staging.s3-ap-southeast-1.amazonaws.com/empty_profile_picture.png',
    },
    {
        id: 7,
        name: 'chris',
        thumb: 'https://cueup-staging.s3-ap-southeast-1.amazonaws.com/empty_profile_picture.png',
    },
    {
        id: 8,
        name: 'chris',
        thumb: 'https://cueup-staging.s3-ap-southeast-1.amazonaws.com/empty_profile_picture.png',
    },
    {
        id: 9,
        name: 'chris',
        thumb: 'https://cueup-staging.s3-ap-southeast-1.amazonaws.com/empty_profile_picture.png',
    },
    {
        id: 10,
        name: 'chris',
        thumb: 'https://cueup-staging.s3-ap-southeast-1.amazonaws.com/empty_profile_picture.png',
    },
];

const SidebarChat = () => {
    const [activeChat, setActiveChat] = useState();

    const activeChats = mockedChats.slice(0, 7);

    return (
        <FixedWrapper>
            {activeChat && <ChatWrapper chat={activeChat} onClose={() => setActiveChat(null)} />}
            <ChatList>
                {activeChats.map((c) => (
                    <ChatBubble
                        active={c.id === activeChat?.id}
                        key={c.id}
                        onClick={() => setActiveChat(c)}
                        {...c}
                    />
                ))}
            </ChatList>
        </FixedWrapper>
    );
};

const ChatBubble = ({ thumb, name, onClick, active }) => {
    return (
        <ChatItem onClick={onClick} className={active ? 'active' : ''}>
            <ChatAvatarWrapper>
                <ShadowWrapper>
                    <img src={thumb} />
                </ShadowWrapper>
            </ChatAvatarWrapper>

            <NameBox>{name}</NameBox>
        </ChatItem>
    );
};

const ChatWrapper = ({ chat, onClose }) => {
    const { thumb, name } = chat;
    return (
        <ChatBox>
            <ChatHeader>
                <Row>
                    <Avatar small src={thumb} style={{ zIndex: 1, marginRight: '8px' }} />
                    <p>{name}</p>
                </Row>
                <ClosePopupButton small onClick={onClose} />
            </ChatHeader>
        </ChatBox>
    );
};

const ChatHeader = styled.div`
    padding: 8px;
    display: flex;
    background: #fff;
    border-bottom: 1px solid #ebebeb;
    align-items: center;
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
    max-width: 200px;
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

export default SidebarChat;
