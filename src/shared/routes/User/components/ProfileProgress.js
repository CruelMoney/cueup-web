import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import checkmarkCicleIcon from '@iconify/icons-ion/checkmark-circle';
import addCircleIcon from '@iconify/icons-ion/add-circle';

import { useHistory } from 'react-router-dom';
import { Body, SmallBold, SmallHeader } from '../../../components/Text';
import { Col, Row } from '../../../components/Blocks';
import { SimpleSharing } from '../../../components/common/Sharing-v2';
const checks = [
    {
        label: 'Add profile picture',
        check: (u) => !!u.picture && !u.picture.path.includes('default-profile-pic'),
        linkTo: '/u/settings#profile',
    },
    {
        label: 'Add location',
        check: (u) => !!u.playingLocation,
        linkTo: '/u/settings?modal=location',
    },
    {
        label: 'Add artist name',
        check: (u) => !!u.artistName,
        linkTo: '/u/settings#profile',
    },
    {
        label: 'Add photos or connect Instagram',
        check: (u) => u.media?.edges.length > 0,
        linkTo: 'photos',
    },
    {
        label: 'Add a track or connect SoundCloud',
        check: (u) => u.sounds?.edges.length > 0,
        linkTo: 'sounds',
    },
    {
        label: 'Add a testimonial',
        check: (u) => !!u.highlightedReview,
        linkTo: 'reviews',
    },
    {
        label: 'Download the app',
        check: (u) => !!u.appMetadata.hasInstalledApp,
        linkTo: 'overview?modal=app',
    },
    {
        label: 'Add payout methods',
        check: (u) => !!u.payoutMethods?.length,
        linkTo: '/u/settings?modal=payoutMethods',
    },
    {
        label: 'Write a bio',
        check: (u) => !!u.userMetadata.bio,
        linkTo: '/u/settings?modal=bio',
    },
];

const ProgressItemText = styled(SmallHeader)`
    font-size: 15px;
    color: ${({ done }) => (done ? '#98A4B3' : '#4D6480')};
    text-decoration: ${({ done }) => (done ? 'line-through' : 'none')};
    line-height: 15px;
    margin-bottom: 0;
    margin-left: 6px;
`;

const ProgressItem = ({ label, done, linkTo, onClick }) => {
    const history = useHistory();

    const Content = (
        <Row style={{ marginBottom: '15px' }} middle>
            {done ? (
                <Icon icon={checkmarkCicleIcon} color={'#50E3C2'} style={{ fontSize: '20px' }} />
            ) : (
                <Icon icon={addCircleIcon} color={'#4D6480'} style={{ fontSize: '20px' }} />
            )}
            <ProgressItemText done={done}>{label}</ProgressItemText>
        </Row>
    );

    // if (done) {
    //     return Content;
    // }

    console.log({ linkTo });
    const handleClick = () => {
        onClick && onClick();
        linkTo && history.push(linkTo);
    };

    return <button onClick={handleClick}>{Content}</button>;
};

const ProfileProgress = ({ user, onClick, hideSharing = false }) => {
    const items = checks
        .map((c) => ({ ...c, done: c.check(user) }))
        .sort((a, b) => b.done - a.done);

    const progress = items.filter((c) => c.done).length / items.length;

    if (progress === 1 || !user.isDj) {
        if (hideSharing) {
            return null;
        }
        return <SimpleSharing shareUrl={user && `/user/${user.permalink}/overview}]`} />;
    }
    return (
        <Col
            style={{
                alignItems: 'flex-start',
                marginBottom: '30px',
            }}
        >
            <Body>Complete your profile</Body>
            <ProgressBar progress={progress} />

            {items.map((c) => (
                <ProgressItem key={c.label} onClick={onClick} {...c} />
            ))}
        </Col>
    );
};

const BarTrack = styled.div`
    background-color: #d3f8f0;
    height: 12px;
    width: 100%;
    border-radius: 6px;
`;

const BarFill = styled.div`
    height: 12px;
    background: #50e3c2;
    box-shadow: 0 0 1px 1px rgba(255, 255, 255, 0.5), 0 0 8px 0 #00ffc6;
    border-radius: 6px;
    transition: all 500ms cubic-bezier(0.785, 0.135, 0.15, 0.86);
`;

export const ProgressBar = ({ progress }) => {
    const [renderProgress, setRenderProgress] = useState(0);

    useEffect(() => {
        setRenderProgress(progress);
    }, [progress]);

    return (
        <Row middle style={{ marginBottom: '15px', width: '100%' }}>
            <BarTrack>
                <BarFill style={{ width: renderProgress * 100 + '%' }} />
            </BarTrack>
            <SmallBold
                style={{
                    marginBottom: 0,
                    marginLeft: '6px',
                }}
            >
                {Math.round(progress * 100)}%
            </SmallBold>
        </Row>
    );
};

export default ProfileProgress;
