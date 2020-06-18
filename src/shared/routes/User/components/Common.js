import React from 'react';
import styled from 'styled-components';

import { Icon, InlineIcon } from '@iconify/react';
import medalIcon from '@iconify/icons-ion/checkmark-circle';
import startIcon from '@iconify/icons-ion/person-circle';

import { Row, ShowBelow } from '../../../components/Blocks';
import { Stat } from '../../../components/Text';
import { CTAShadow } from '../../../components/Sidebar';
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
    z-index: 99;
    margin-bottom: env(safe-area-inset-bottom);
    > div,
    button {
        position: relative;
    }
`;

export const MobileBookingButton = ({ children, ...props }) => (
    <ShowBelow>
        <StickyBookingButtonWrapper>
            <div>
                <CTAShadow />
                {children || <BookingButton {...props} />}
            </div>
        </StickyBookingButtonWrapper>
    </ShowBelow>
);

export const CertifiedVerified = ({ certified, identityVerified }) => (
    <>
        {certified && (
            <Tooltip
                text={
                    'This dj has been certified by Cueup. The Cueup team has personally met and seen this dj play.'
                }
            >
                {({ ref, close, open }) => (
                    <IconRow ref={ref} onMouseEnter={open} onMouseLeave={close} className="iconRow">
                        <Icon icon={medalIcon} color={'#50E3C2'} style={{ fontSize: '24px' }} />
                        Cueup certified
                    </IconRow>
                )}
            </Tooltip>
        )}
        {identityVerified && (
            <IconRow className="iconRow">
                <Icon icon={startIcon} color={'#50E3C2'} style={{ fontSize: '24px' }} />
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
