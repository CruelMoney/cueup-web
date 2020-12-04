import React from 'react';
import styled, { css } from 'styled-components';
import { Icon } from '@iconify/react';
import pinIcon from '@iconify/icons-ion/location-sharp';
import membersinceIcon from '@iconify/icons-ion/md-contact';
import websiteIcon from '@iconify/icons-ion/globe-outline';
import mailIcon from '@iconify/icons-ion/ios-email';
import phoneIcon from '@iconify/icons-ion/call';
import instagramIcon from '@iconify/icons-ion/logo-instagram-outline';

import soundcloudLogo from '@iconify/icons-simple-icons/soundcloud';
import mixcloudIcon from '@iconify/icons-simple-icons/mixcloud';

import shieldIcon from '@iconify/icons-entypo/shield';
import shieldCheckmark from '@iconify/icons-ion/shield-checkmark';

import { NavLink } from 'react-router-dom';
import moment from 'moment';
import Rating from 'components/common/RatingNew';
import { userRoutes } from 'constants/locales/appRoutes';
import { Row, ShowBelow } from '../../../components/Blocks';
import { Stat } from '../../../components/Text';
import Tooltip from '../../../components/Tooltip';
import BookingButton from './BookingButton';

export const Stats = ({ experience, followers, white, marginRight }) => {
    return (
        <Row>
            {followers && (
                <Stat
                    label={'followers'}
                    value={followers.totalFormatted}
                    style={{ marginRight: marginRight || '24px' }}
                    white={white}
                />
            )}
            {experience > 0 && <Stat white={white} label={'played gigs'} value={experience} />}
        </Row>
    );
};

const StickyBookingButtonWrapper = styled.div`
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 15px;
    z-index: 90;
    padding-bottom: env(safe-area-inset-bottom);
    background-color: #fff;
    border-top: 1px solid #e9e9e9;
    > div,
    button {
        position: relative;
        margin-bottom: 15px;
    }
`;

export const MobileBookingButton = ({ children, ...props }) => (
    <ShowBelow width={664}>
        <StickyBookingButtonWrapper>
            <div>{children}</div>
        </StickyBookingButtonWrapper>
    </ShowBelow>
);

export const CertifiedVerified = ({ certified, identityVerified }) => (
    <>
        {certified && (
            <Tooltip
                text={
                    'Cueup has certified this DJ. The Cueup team has personally met and seen this DJ play.'
                }
            >
                {({ ref, close, open }) => (
                    <IconRow ref={ref} onMouseEnter={open} onMouseLeave={close} className="iconRow">
                        <Icon icon={shieldIcon} color={'#50E3C2'} style={{ fontSize: '24px' }} />
                        Cueup certified
                    </IconRow>
                )}
            </Tooltip>
        )}
        {identityVerified && (
            <IconRow className="iconRow">
                <Icon icon={shieldCheckmark} color={'#50E3C2'} style={{ fontSize: '24px' }} />
                Identity verified
            </IconRow>
        )}
    </>
);

export const IconRow = styled(Row)`
    font-size: 15px;
    color: #98a4b3;
    align-items: center;
    margin-bottom: 12px;
    display: inline-flex;
    font-weight: 600;
    svg {
        margin-right: 15px;
    }
`;

export const IconRowLink = styled(IconRow).attrs({
    as: 'a',
})``;

const ReviewsCount = styled.p`
    opacity: 0.6;
    font-size: 15px;
    color: #ffffff;
    display: inline-block;
    margin-bottom: 0;
    line-height: 1em;
    font-weight: 600;
    &:hover {
        text-decoration: underline;
    }
    ${({ dark }) =>
        dark &&
        css`
            color: rgb(50, 50, 93);
        `}
`;

const RatingWrapper = styled.div`
    display: inline-block;
`;

export const UserRating = ({ reviews, dark, rating, style }) => {
    if (!rating) {
        return null;
    }
    return (
        <Row center style={style}>
            <RatingWrapper>
                <Rating color={dark ? undefined : '#ffffffd1'} rating={rating} disabled />
            </RatingWrapper>
            <NavLink to={userRoutes.reviews}>
                <ReviewsCount dark={dark}>{reviews?.pageInfo.totalDocs} reviews</ReviewsCount>
            </NavLink>
        </Row>
    );
};

export const UserInfo = ({ user }) => {
    const { userMetadata = {}, appMetadata = {}, playingLocation, email, userSettings = {} } =
        user || {};
    const {
        createdAt,
        certified,
        identityVerified,
        instagramUsername,
        isPro,
        soundCloudUsername,
        soundCloudUrl,
        mixcloudUsername,
        mixcloudUrl,
    } = appMetadata;

    const { publicDisplay } = userSettings;
    const { website, phone } = userMetadata;

    const memberSince = moment(createdAt).format('MMMM YYYY');

    return (
        <>
            <IconRow className="iconRow">
                <Icon
                    icon={membersinceIcon}
                    color={'#98a4b3'}
                    style={{ marginRight: '15px', fontSize: '24px' }}
                />
                Member since {memberSince}
            </IconRow>
            {playingLocation && (
                <IconRow>
                    <Icon
                        icon={pinIcon}
                        color={'#98a4b3'}
                        style={{ marginRight: '15px', fontSize: '24px' }}
                    />
                    {playingLocation.name}
                </IconRow>
            )}
            <CertifiedVerified certified={certified} identityVerified={identityVerified} />
            {instagramUsername && isPro && publicDisplay?.INSTAGRAM.public && (
                <IconRowLink
                    target="_blank"
                    rel="noopener noreferrer ugc"
                    href={'https://instagram.com/' + instagramUsername}
                    title="Visit Instagram profile"
                >
                    <Icon
                        icon={instagramIcon}
                        color={'#98a4b3'}
                        style={{ marginRight: '15px', fontSize: '24px' }}
                    />
                    {instagramUsername}
                </IconRowLink>
            )}

            {soundCloudUsername && isPro && publicDisplay?.SOUNDCLOUD.public && (
                <IconRowLink
                    href={`${soundCloudUrl}?ref=cueup`}
                    target="_blank"
                    rel="noopener noreferrer ugc"
                    title="Visit SoundCloud profile"
                >
                    <Icon
                        icon={soundcloudLogo}
                        color={'#98a4b3'}
                        style={{ marginRight: '15px', fontSize: '24px' }}
                    />
                    {soundCloudUsername}
                </IconRowLink>
            )}

            {mixcloudUrl && isPro && publicDisplay?.MIXCLOUD.public && (
                <IconRowLink
                    href={`${mixcloudUrl}?ref=cueup`}
                    target="_blank"
                    rel="noopener noreferrer ugc"
                    title="Visit Mixcloud profile"
                >
                    <Icon
                        icon={mixcloudIcon}
                        color={'#98a4b3'}
                        style={{ marginRight: '15px', fontSize: '24px' }}
                    />
                    {mixcloudUsername}
                </IconRowLink>
            )}
            {website && isPro && publicDisplay?.WEBSITE.public && (
                <>
                    <IconRowLink
                        target="_blank"
                        rel="noopener noreferrer nofollow ugc"
                        href={website}
                        title="Visit website"
                    >
                        <Icon
                            icon={websiteIcon}
                            color={'#98a4b3'}
                            style={{ marginRight: '15px', fontSize: '24px' }}
                        />
                        {new URL(website).hostname}
                    </IconRowLink>
                </>
            )}
            {email && isPro && publicDisplay?.EMAIL.public && (
                <IconRowLink href={`mailto:${email}`} title="Send an email">
                    <Icon
                        icon={mailIcon}
                        color={'#98a4b3'}
                        style={{ marginRight: '15px', fontSize: '24px' }}
                    />
                    {email}
                </IconRowLink>
            )}
            {phone && isPro && publicDisplay?.PHONE.public && (
                <IconRowLink href={`tel:${phone}`} title="Call">
                    <Icon
                        icon={phoneIcon}
                        color={'#98a4b3'}
                        style={{ marginRight: '15px', fontSize: '24px' }}
                    />
                    {phone}
                </IconRowLink>
            )}
        </>
    );
};
