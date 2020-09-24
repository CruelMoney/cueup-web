import React from 'react';
import styled, { css } from 'styled-components';

import { NavLink } from 'react-router-dom';
import { InlineIcon } from '@iconify/react';
import pinIcon from '@iconify/icons-ion/location-sharp';
import GracefullImage from 'components/GracefullImage';
import { Body } from 'components/Text';
import { Col, Row, RowWrap } from 'components/Blocks';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes } from 'constants/locales/appRoutes';
import { ProFeature } from './FormComponents';

const InnerContent = ({
    userMetadata,
    appMetadata,
    artistName,
    playingLocations,
    picture,
    genres,
    isNew,
    permalink,
}) => {
    const { translate } = useTranslate();

    const route = `${translate(appRoutes.user)}/${permalink}/overview`;
    const location = playingLocations?.[0]?.name;

    return (
        <NavLink to={route} draggable={false}>
            <GracefullImage
                animate
                draggable={false}
                src={picture?.path}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    objectFit: 'cover',
                    borderRadius: '0.2em',
                }}
            />
            <BottomGradient />
            <DjCardContent>
                <Row between>
                    {appMetadata?.isPro ? (
                        <ProFeature disabled style={{ marginLeft: 0, marginRight: 6 }}>
                            Pro
                        </ProFeature>
                    ) : (
                        <span />
                    )}
                    {isNew && <Pill style={{ marginLeft: 0, marginTop: 0 }}>NEW</Pill>}
                </Row>
                <div style={{ flex: 1 }} />
                <Row between style={{ alignItems: 'flex-end' }}>
                    <Col>
                        <h3>{artistName || userMetadata?.firstName}</h3>
                        {location && (
                            <Body
                                white
                                style={{
                                    marginTop: '0.3em',
                                    fontSize: '0.15em',
                                    lineHeight: '1em',
                                }}
                            >
                                <InlineIcon icon={pinIcon} /> {location}
                            </Body>
                        )}
                    </Col>
                    {genres && (
                        <Col style={{ maxWidth: '40%' }}>
                            <RowWrap right>
                                {genres.slice(0, 5).map((g, idx) => (
                                    <Pill key={idx}>{g.trim()}</Pill>
                                ))}
                            </RowWrap>
                        </Col>
                    )}
                </Row>
            </DjCardContent>
        </NavLink>
    );
};

export const FeaturedDJCard = ({ item, ...props }) => {
    return <Card {...props}>{item && <InnerContent {...item} />}</Card>;
};

const Pill = styled(Body)`
    border-radius: 0.6em;
    font-size: 0.1em;
    line-height: 1em;
    background-color: #fff;
    padding: 0.4em 0.5em;
    font-weight: 500;
    letter-spacing: 1px;
    color: #122b48;
    text-transform: uppercase;
    margin-left: 0.5em;
    margin-top: 0.5em;
`;

const DjCardContent = styled.div`
    height: 100%;
    width: 100%;
    padding: 0.2em;
    position: relative;
    display: flex;
    justify-content: flex-end;
    flex-direction: column;

    h3 {
        font-size: 0.2em;
        font-weight: 500;
        color: #fff;
        text-transform: capitalize;
    }
`;

const BottomGradient = styled.div`
    /* Rectangle 11 */
    position: absolute;
    height: 50%;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(0deg, #000000 22%, rgba(0, 0, 0, 0) 100%);
    border-radius: 0 0 0.2em 0.2em;
`;

const Card = styled.div`
    border-radius: 0.2em;
    overflow: hidden;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    transition: transform 1000ms ease;
    ${({ animate }) =>
        animate
            ? css`
                  transform: scale(1);
                  &:hover {
                      transform: scale(1.05);
                  }
              `
            : null}
`;

export default FeaturedDJCard;
