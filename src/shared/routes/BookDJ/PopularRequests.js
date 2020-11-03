import React from 'react';
import styled from 'styled-components';

import { useServerContext } from 'components/hooks/useServerContext';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes } from 'constants/locales/appRoutes';
import { Container } from 'components/Blocks';
import { H2, H3 } from 'components/Text';

import { CustomSection } from './Components';

import { ReactComponent as HipHopIcon } from './assets/icons/hiphop.svg';
import { ReactComponent as PartyLightsIcon } from './assets/icons/partyLights.svg';
import { ReactComponent as SmokeIcon } from './assets/icons/smoke.svg';
import { ReactComponent as SpeakerIcon } from './assets/icons/speaker.svg';
import { ReactComponent as VinylIcon } from './assets/icons/vinyl.svg';
import { ReactComponent as Top40Icon } from './assets/icons/top40.svg';

const ScrollableFullWidthGrid = styled.ol`
    display: flex;
    list-style: none;
    overflow: auto;
    margin-left: calc((100vw - 100%) / -2);
    margin-right: calc((100vw - 100%) / -2);
    padding-left: calc((100vw - 100%) / 2);
    padding-right: calc((100vw - 100%) / 2);
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }
    padding-top: 15px;
    padding-bottom: 15px;
    margin-bottom: -15px;
    -webkit-overflow-scrolling: touch;
    justify-content: flex-start;
    -webkit-box-pack: start;
    &:after {
        content: '';
        padding: 16px 0;
        padding-right: calc((100vw - 100%) / 2);
    }
`;

const RequestWrapper = styled.li`
    box-shadow: 0 3px 10px 0 rgba(18, 43, 72, 0.15);
    min-width: 240px;
    padding: 1em;
    padding-bottom: 0.5em;
    border-radius: 20px;
    margin-right: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    &:last-child {
        margin-right: 0;
    }
`;

const RequestItem = ({ label, url, Icon, idx, ...props }) => {
    return (
        <RequestWrapper
            ariaLabel={label}
            itemProp="itemListElement"
            itemScope=" "
            itemType="https://schema.org/ListItem"
            {...props}
        >
            <meta itemProp="position" content={idx + 1} />
            <meta itemProp="name" content={label} />
            {url && <meta itemProp="url" content={url} />}
            <Icon />
            <H3 small aria-hidden="true" style={{ marginTop: '0.75em' }}>
                {label}
            </H3>
        </RequestWrapper>
    );
};

const requestdata = [
    {
        label: 'Top 40',
        Icon: Top40Icon,
        state: { genres: ['Top 40'] },
    },
    {
        label: 'Hip Hop',
        Icon: HipHopIcon,
        state: { genres: ['Hip Hop'] },
    },
    {
        label: 'Vinyls',
        Icon: VinylIcon,
        state: { genres: ['Vinyl'] },
    },
    {
        label: 'Sound system',
        Icon: SpeakerIcon,
        state: {
            equipment: {
                speakers: true,
            },
        },
    },
    {
        label: 'Party lights',
        Icon: PartyLightsIcon,
        state: {
            equipment: {
                lights: true,
            },
        },
    },
    {
        label: 'Smoke machine',
        Icon: SmokeIcon,
        state: {
            equipment: {
                smokeMachine: true,
            },
        },
    },
];

const PopularRequests = ({ activeLocation, onClick }) => {
    const { translate } = useTranslate();
    const { environment } = useServerContext();

    return (
        <CustomSection>
            <Container>
                <H2 small>Popular requests for {activeLocation.name} DJs</H2>

                <ScrollableFullWidthGrid>
                    {requestdata.map((item, idx) => (
                        <RequestItem
                            key={idx}
                            idx={idx}
                            onClick={onClick(item.state)}
                            url={environment.WEBSITE_URL + translate(appRoutes.search)}
                            {...item}
                        />
                    ))}
                </ScrollableFullWidthGrid>
            </Container>
        </CustomSection>
    );
};

export default PopularRequests;
