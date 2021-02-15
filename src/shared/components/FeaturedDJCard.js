import React from 'react';
import styled, { css } from 'styled-components';

import { NavLink } from 'react-router-dom';
import { InlineIcon } from '@iconify/react';
import pinIcon from '@iconify/icons-ion/location-sharp';
import GracefullImage from 'components/GracefullImage';
import { Body, BodyBold, BodySmall, SmallBold } from 'components/Text';
import { Col, Row, RowWrap } from 'components/Blocks';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes } from 'constants/locales/appRoutes';
import { ProFeature } from './FormComponents';

const InnerContent = (user) => {
    const {
        userMetadata,
        appMetadata,
        artistName,
        playingLocations,
        picture,
        genres,
        isNew,
        permalink,
        pricing,
    } = user;
    const { translate } = useTranslate();

    const route = `${translate(appRoutes.user)}/${permalink}/overview`;
    const location = playingLocations?.[0]?.name;

    return (
        <NavLink
            to={route}
            draggable={false}
            itemProp="url"
            target="_blank"
            rel="noopener noreferrer"
        >
            <GracefullImage
                itemProp="image"
                draggable={false}
                lazyload
                src={picture?.path}
                alt={artistName || userMetadata?.firstName}
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

                    <span />
                </Row>
                <div style={{ flex: 1 }} />
                <Row between style={{ alignItems: 'flex-end' }}>
                    <Col>
                        {appMetadata?.rating ? (
                            <Row middle style={{ color: '#fff', marginBottom: 3, marginLeft: -1 }}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentcolor"
                                    height={20}
                                    width={20}
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>

                                <BodySmall
                                    style={{ color: '#fff', fontWeight: 500, marginBottom: -1 }}
                                >
                                    {parseFloat(appMetadata.rating).toFixed(1)}
                                </BodySmall>
                            </Row>
                        ) : (
                            <span />
                        )}
                        <h3 itemProp="name">{artistName || userMetadata?.firstName}</h3>
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
                        {pricing && <Pricing pricing={pricing} />}
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

const Pricing = ({ pricing }) => {
    const formatter = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: pricing.hourlyRate.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return (
        <Body white>
            <b>{formatter.format(pricing.hourlyRate.amount / 100)}</b> / hour
        </Body>
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
    border: ${({ border }) => (border ? '0.5px solid rgba(207, 215, 223, 0.5)' : 'none')};
    ${({ animate }) =>
        animate
            ? css`
                  transform: scale(1);
                  &:hover {
                      transform: scale(1.05);
                  }
              `
            : null};

    img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        object-fit: cover;
        border-radius: 0.2em;
    }
`;

export default FeaturedDJCard;
