import React from 'react';
import styled from 'styled-components';

const mockedChats = [
    {
        name: 'chris',
        thumb: 'https://cueup-staging.s3-ap-southeast-1.amazonaws.com/empty_profile_picture.png',
    },
    {
        name: 'chris',
        thumb: 'https://cueup-staging.s3-ap-southeast-1.amazonaws.com/empty_profile_picture.png',
    },
];

const SidebarChat = () => {
    return (
        <FixedWrapper>
            <ChatList>{mockedChats.map(ChatBubble)}</ChatList>
        </FixedWrapper>
    );
};

const ChatBubble = ({ thumb, name }) => {
    return (
        <ChatItem>
            <ChatAvatarWrapper>
                <ShadowWrapper>
                    <img src={thumb} />
                </ShadowWrapper>
            </ChatAvatarWrapper>

            <NameBox>{name}</NameBox>
        </ChatItem>
    );
};

const NameBox = styled.div`
    display: none;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-100%, -50%);
    background-color: white;
    padding: 0.75em;
    border-radius: 12px;
    max-width: 200px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(0, 0, 0, 0.2) 0px 12px 28px 0px;
    &:after {
        content: '';
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(50%, -50%) rotate(45deg);
        height: 1em;
        width: 1em;
        background-color: #fff;
        border-top-right-radius: 3px;
    }
`;

const FixedWrapper = styled.div`
    position: fixed;
    bottom: 70px;
    right: 0;
    z-index: 10;
`;

const ChatList = styled.ul`
    display: flex;
    flex-direction: column;
    position: relative;
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
