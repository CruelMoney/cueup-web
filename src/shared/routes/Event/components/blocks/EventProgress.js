import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-apollo';
import { NavLink } from 'react-router-dom';
import { eventRoutes } from 'routes/Event/routes';
import checkmark from '../../../../assets/checkmark.svg';
import { EVENT_GIGS } from '../../gql';
import ConditionalWrap from '../../../../components/ConditionalWrap';

const EventProgress = ({ theEvent = {} }) => {
    const { id, hash } = theEvent;
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

    const accepted = data?.event?.gigs.some((g) => g.offer);

    return (
        <Wrapper>
            <ProgressStep label={'Create event'} completed />
            <ProgressStep label={'Get offers from DJs'} completed={accepted} />
            <ProgressStep label={'Confirm and pay'} completed={!!theEvent.chosenGig} />
            <ProgressStep
                label={'Review'}
                completed={theEvent && theEvent.review}
                to={eventRoutes.review}
            />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 80px;
    margin-left: 42px;
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

const ProgressStep = ({ label, completed, to }) => {
    return (
        <ConditionalWrap
            condition={true}
            wrap={(children) =>
                to ? <NavLink to={to}>{children}</NavLink> : <div>{children}</div>
            }
        >
            <Step completed={completed}>
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
