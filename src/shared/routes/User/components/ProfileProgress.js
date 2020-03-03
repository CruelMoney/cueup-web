import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CheckCircle from 'react-ionicons/lib/MdAddCircle';
import CheckCircleDone from 'react-ionicons/lib/MdCheckmarkCircle';
import { NavLink, useHistory } from 'react-router-dom';
import { Body, SmallBold, SmallHeader } from '../../../components/Text';
import { Col, Row } from '../../../components/Blocks';
import { SimpleSharing } from '../../../components/common/Sharing-v2';
const checks = [
    {
        label: 'Add profile picture',
        check: (u) => !!u.picture && !u.picture.path.includes('default-profile-pic'),
        linkTo: 'settings#profile',
    },
    {
        label: 'Add artist name',
        check: (u) => !!u.artistName,
        linkTo: 'settings#profile',
    },
    {
        label: 'Add photos or connect Instagram',
        check: (u) => u.media.edges.length > 0,
        linkTo: 'photos',
    },
    {
        label: 'Add a track or connect SoundCloud',
        check: (u) => u.sounds.edges.length > 0,
        linkTo: 'sounds',
    },
    {
        label: 'Highlight a testimonial',
        check: (u) => !!u.highlightedReview,
        linkTo: 'reviews',
    },
    {
        label: 'Download the app',
        check: (u) => !!u.appMetadata.hasInstalledApp,
        linkTo: '/signup',
    },
    {
        label: 'Add payout methods',
        check: (u) => !!u.payoutMethods?.length,
        linkTo: 'settings?modal=payoutMethods',
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
                <CheckCircleDone color={'#50E3C2'} fontSize={'20px'} />
            ) : (
                <CheckCircle color={'#4D6480'} fontSize={'20px'} />
            )}
            <ProgressItemText done={done}>{label}</ProgressItemText>
        </Row>
    );

    if (done) {
        return Content;
    }

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
