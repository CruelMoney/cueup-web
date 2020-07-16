import React from 'react';
import styled, { css } from 'styled-components';
import { useQuery } from 'react-apollo';
import { NavLink } from 'react-router-dom';
import { eventRoutes } from 'constants/locales/appRoutes';
import { eventStates } from 'constants/constants';
import { SecondaryButton } from 'components/Blocks';
import checkmark from '../../../../assets/checkmark.svg';
import { EVENT_GIGS } from '../../gql';
import ConditionalWrap from '../../../../components/ConditionalWrap';

const EventProgress = ({ theEvent = {} }) => {
    const { id, hash, organizer } = theEvent;
    const { data = {} } = useQuery(EVENT_GIGS, {
        skip: !id || !hash,
        variables: {
            id,
            hash,
        },
    });
    if (!data?.event) {
        return null;
    }

    const emailVerified = organizer?.appMetadata?.emailVerified;

    const accepted = data?.event?.gigs.some((g) => g.offer);

    return (
        <Sticky>
            <Wrapper>
                <ProgressStep label={'Create event'} completed />
                {!emailVerified && (
                    <ProgressStep small to={eventRoutes.requirements} label={'Verify email'} />
                )}
                <ProgressStep label={'Get offers from DJs'} completed={accepted} />
                <ProgressStep
                    label={'Book a DJ'}
                    completed={theEvent?.status === eventStates.CONFIRMED}
                />
                <ProgressStep
                    label={'Review the DJ'}
                    completed={theEvent && theEvent.review}
                    to={eventRoutes.review}
                />
            </Wrapper>
        </Sticky>
    );
};

const Sticky = styled.div`
    position: sticky;
    top: 80px;
    margin-left: 42px;
`;
const Wrapper = styled.div`
    display: flex;
    flex-direction: column;

    > * {
        margin-bottom: 2.3em;
        &:last-child > *:after {
            display: none;
        }
    }
    @media only screen and (max-width: 768px) {
        flex-direction: row;
        position: relative;
        top: initial;
        margin: 0;
        top: -20px;
        justify-content: space-between;
    }

    @media only screen and (max-width: 420px) {
        display: none;
    }
`;

const ProgressStep = ({ label, small, completed, to }) => {
    return (
        <ConditionalWrap
            condition={true}
            wrap={(children) =>
                to ? <NavLink to={to}>{children}</NavLink> : <div>{children}</div>
            }
        >
            <Step
                small={small}
                completed={completed}
                data-cy={completed ? 'progress-step-complete' : 'progress-step-incomplete'}
            >
                {completed && <img src={checkmark} alt="Checkmark" />}
                {label}
            </Step>
        </ConditionalWrap>
    );
};

const Step = styled.div`
    background: ${({ completed }) => (completed ? '#98A4B3' : '#F3F6F7')};
    border-radius: 1.75em;
    height: 3.3em;
    width: 16.6em;
    line-height: 3.3em;
    font-weight: 700;
    font-size: 18px;
    color: ${({ completed }) => (completed ? '#fff' : '#4d6480')};
    text-align: center;
    position: relative;
    margin: 0 auto;

    ${({ small }) =>
        small &&
        css`
            font-size: 14px;
            line-height: 3em;
            border: 2px solid #98a4b3;
        `}
    > img {
        position: absolute;
        left: 1.33em;
        top: 50%;
        transform: translateY(-50%);
        width: 1em;
    }
    :after {
        content: '';
        display: block;
        position: relative;
        height: 2em;
        width: 6px;
        border-radius: 3px;
        background-color: #f6f8f9;
        top: 3px;
        margin-bottom: 3px;
        margin: auto;
    }

    @media only screen and (max-width: 1024px) {
        font-size: 15px;
    }
    @media only screen and (max-width: 768px) {
        font-size: 12px;
        width: 13em;
        :after {
            display: none;
        }
    }
`;

export default EventProgress;
