import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import { NavLink } from 'react-router-dom';
import { InlineIcon } from '@iconify/react';
import checkmark from '@iconify/icons-ion/checkmark-circle';
import arrow from '@iconify/icons-ion/arrow-forward';
import { eventRoutes } from 'constants/locales/appRoutes';
import { eventStates } from 'constants/constants';
import { BodySmall, H3 } from 'components/Text';
import GreyBox from 'components/GreyBox';
import { Col } from 'components/Blocks';
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

    let idx = 0;

    return (
        <Sticky>
            <Wrapper>
                <GreyBox>
                    <H3 small dark style={{ marginBottom: 12 }}>
                        What's next?
                    </H3>

                    {!emailVerified && (
                        <ProgressStep
                            to={eventRoutes.requirements}
                            label={++idx + '. Verify your email'}
                        />
                    )}
                    <ProgressStep
                        active={!accepted && emailVerified}
                        to={eventRoutes.overview}
                        label={++idx + '. Get offers from DJs'}
                        description={
                            "You can message the DJs to let them know you're interested and tell them more about the event."
                        }
                        completed={accepted}
                    />
                    <ProgressStep
                        active={accepted && theEvent?.status !== eventStates.CONFIRMED}
                        label={++idx + '. Confirm booking'}
                        completed={theEvent?.status === eventStates.CONFIRMED}
                    />
                    <ProgressStep
                        active={theEvent?.status === eventStates.CONFIRMED}
                        label={++idx + '. Review the DJ'}
                        completed={theEvent && theEvent.review}
                        to={eventRoutes.review}
                    />
                </GreyBox>
            </Wrapper>
        </Sticky>
    );
};

const Sticky = styled.div`
    position: sticky;
    top: 15px;
    margin-left: 30px;
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
        justify-content: space-between;
    }

    @media only screen and (max-width: 420px) {
        display: none;
    }
`;

const ProgressStep = ({ label, small, active, completed, to, description }) => {
    return (
        <ConditionalWrap
            condition={true}
            wrap={(children) =>
                to ? <NavLink to={to}>{children}</NavLink> : <div>{children}</div>
            }
        >
            <Col style={{ marginBottom: '1.5em', width: 250 }}>
                <Step
                    small={small}
                    active={active}
                    completed={completed}
                    data-cy={completed ? 'progress-step-complete' : 'progress-step-incomplete'}
                >
                    <span>{label}</span>
                    {completed && <InlineIcon icon={checkmark} width={18} height={18} />}
                    {active && (
                        <InlineIcon className={'active-icon'} icon={arrow} width={18} height={18} />
                    )}
                </Step>
                {!!(description && active) && (
                    <BodySmall style={{ marginLeft: '1.1em', marginTop: 4 }}>
                        {description}
                    </BodySmall>
                )}
            </Col>
        </ConditionalWrap>
    );
};

const Step = styled.div`
    border-radius: 1.75em;
    font-weight: 500;
    width: 250px;
    position: relative;
    margin: 0 auto;

    span {
        opacity: ${({ active }) => (active ? 1 : 0.3)};
    }
    > svg {
        float: right;
    }
    .active-icon {
        position: absolute;
        left: -1.4em;
        float: none;
        top: 0.1em;
        color: #00d1ff;
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
