import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { Body, BodyBold, BodySmall } from 'components/Text';
import { Avatar, ClosePopupButton, Row } from 'components/Blocks';
import supportImg from './support.jpg';
import { showSupportChat } from '.';

export const keyframeFadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: none; }

`;

const Wrapper = styled.div`
    position: absolute;
    bottom: 80px;
    left: 24px;
    animation: ${keyframeFadeIn} 500ms ease;
`;

const Card = styled.div`
    background: #fff;
    overflow: hidden;
    border-radius: 4px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 2px 15px 0 rgba(60, 50, 94, 0.11);
    padding: 1em;
    margin-left: 10px;
    cursor: pointer;
`;

const SupportChatNudge = ({ message }) => {
    const [closed, setClosed] = useState();
    const portal = useRef();

    useEffect(() => {
        portal.current = document.querySelector('#notification-portal');
        setClosed(false);
    }, []);

    const openChatAndClose = () => {
        showSupportChat();
        setClosed(true);
    };

    if (closed || !portal.current) {
        return null;
    }

    return createPortal(
        <Wrapper>
            <ClosePopupButton
                small
                showBg
                style={{ marginBottom: 6 }}
                onClick={() => setClosed(true)}
            />
            <Row bottom onClick={openChatAndClose}>
                <Avatar size="large" src={supportImg} style={{ cursor: 'pointer' }} />
                <Card>
                    <BodyBold style={{ fontSize: 14 }}>Message from Christopher</BodyBold>
                    <Body>{message}</Body>
                    <br />
                    <Body style={{ fontSize: 14 }}>Chat now</Body>
                </Card>
            </Row>
        </Wrapper>,
        portal.current
    );
};

export default SupportChatNudge;
