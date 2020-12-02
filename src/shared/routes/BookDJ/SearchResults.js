import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { InlineIcon } from '@iconify/react';
import pinIcon from '@iconify/icons-ion/location-sharp';
import chatIcon from '@iconify/icons-ion/chatbubbles-outline';
import { NavLink, useLocation } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { Col, Hr, Pill, PrimaryButton, Row, RowWrap } from 'components/Blocks';
import { Body, BodyBold, BodySmall, H2 } from 'components/Text';
import GracefullImage from 'components/GracefullImage';
import GracefullVideo from 'components/GracefullVideo';
import { ProFeature } from 'components/FormComponents';
import { appRoutes } from 'constants/locales/appRoutes';
import useTranslate from 'components/hooks/useTranslate';
import { trackEmptySearch } from 'utils/analytics';
import { useServerContext } from 'components/hooks/useServerContext';
import Map from '../../components/common/Map';
import Pagination from '../../components/Pagination';
import { GreyBox } from './Components';

const loadingGraceStyle = {
    height: '100%',
    width: '100%',
    borderRadius: 0,
    lineHeight: '2em',
};

const ImagePreviews = ({ appMetadata, media, id, picture, playingLocations, loading }) => {
    const renderItems = media?.edges || [];

    const location = playingLocations?.[0];

    let imagecount = renderItems.length || 1;
    if (loading) {
        imagecount = 4;
    }

    return (
        <ImageGrid images={imagecount} singleItem={!location} large={appMetadata?.isPro}>
            <li>
                {loading ? (
                    <Skeleton style={loadingGraceStyle} />
                ) : (
                    <GracefullImage src={picture.path} itemProp="image" />
                )}

                {!loading && !!location && (
                    <Pill>
                        <InlineIcon icon={pinIcon} style={{ marginRight: 3, marginBottom: -1 }} />
                        {location?.name}
                    </Pill>
                )}
            </li>

            {!loading &&
                renderItems.map((m) => (
                    <li key={m.id}>
                        {m.type === 'VIDEO' ? (
                            <GracefullVideo src={m.path} loop autoPlay muted playsInline animate />
                        ) : (
                            <GracefullImage src={m.path} animate />
                        )}
                    </li>
                ))}

            {loading && (
                <>
                    <li>
                        <Skeleton style={loadingGraceStyle} />
                    </li>
                    <li>
                        <Skeleton style={loadingGraceStyle} />
                    </li>
                    <li>
                        <Skeleton style={loadingGraceStyle} />
                    </li>
                    <li>
                        <Skeleton style={loadingGraceStyle} />
                    </li>
                </>
            )}

            {!loading && !renderItems.length && location?.radius && (
                <li className="with-border">
                    <Map
                        zoomScaler={150}
                        hideRoads
                        hideNames
                        noCircle
                        radius={location.radius}
                        defaultCenter={{
                            lat: location.latitude,
                            lng: location.longitude,
                        }}
                        height={'100%'}
                        value={{
                            lat: location.latitude,
                            lng: location.longitude,
                        }}
                        editable={false}
                    />
                </li>
            )}
        </ImageGrid>
    );
};

const ArtistName = ({ loading, artistName, userMetadata, appMetadata }) => {
    if (loading) {
        return (
            <h3>
                <Skeleton />
            </h3>
        );
    }

    return (
        <h3>
            <span itemProp="name">{artistName || userMetadata?.firstName}</span>
            {appMetadata?.isPro && <ProFeature disabled>Pro</ProFeature>}
        </h3>
    );
};

const BioText = styled(BodySmall)`
    max-lines: 2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-height: 3em;
    word-wrap: anywhere;
`;

const GenresRow = styled(RowWrap)`
    margin: 9px 0;
    /* @media only screen and (max-width: 445px) {
       display none;
    } */
`;

const ArtistBio = ({ userMetadata, genres, loading, filterGenres }) => {
    if (loading) {
        return <Skeleton count={3} height={'1em'} style={{ height: 100 }} width={300} />;
    }

    const { bio } = userMetadata;

    const sortedGenres = [...genres];
    // sort to show searched for genres
    if (filterGenres?.length) {
        sortedGenres.sort((a, b) => {
            const aVal = filterGenres.includes(a.toLowerCase()) ? 0 : 1;
            const bVal = filterGenres.includes(b.toLowerCase()) ? 0 : 1;
            return aVal - bVal;
        });
    }

    const maxNum = sortedGenres.length > 5 ? 4 : 5;
    const renderGenres = sortedGenres.slice(0, maxNum);
    const missing = sortedGenres.length - renderGenres.length;

    return (
        <>
            <BioText>{bio}</BioText>
            <GenresRow>
                {renderGenres.map((g) => (
                    <Pill key={g} style={{ marginRight: 4, marginBottom: 4 }}>
                        {g}
                    </Pill>
                ))}
                {missing > 1 && <Pill>...{missing} more</Pill>}
            </GenresRow>
        </>
    );
};

const Price = ({ loading, potential, pricing }) => {
    if (loading) {
        return (
            <BodyBold style={{ fontSize: 16, display: 'block' }}>
                <Skeleton width={80} />
            </BodyBold>
        );
    }
    if (pricing) {
        const formatter = new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: pricing.hourlyRate.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });

        return (
            <Body style={{ fontSize: 16, display: 'block', marginLeft: 15, minWidth: 100 }}>
                <b>{formatter.format(pricing.hourlyRate.amount / 100)}</b> / hour
            </Body>
        );
    }
    if (potential) {
        return null;
    }
    return (
        <BodyBold style={{ fontSize: 16, display: 'block' }}>
            Contact for price
            <InlineIcon icon={chatIcon} style={{ marginLeft: 6, marginBottom: -2 }} />
        </BodyBold>
    );
};

export const DJSearchEntry = ({ children, ...props }) => {
    const { environment } = useServerContext();
    const { translate } = useTranslate();
    let { route } = props;
    if (!route) {
        route = `${translate(appRoutes.user)}/${props.permalink}/overview`;
    }
    return (
        <li itemScope=" " itemType="https://schema.org/ListItem">
            <meta itemProp="position" content={props.idx + 1} />
            <meta itemProp="url" content={environment.WEBSITE_URL + route} />

            <NavLink
                style={{
                    pointerEvents: props.loading ? 'none' : 'auto',
                }}
                rel="noopener noreferrer"
                to={{
                    pathname: route,
                    search: props.search,
                }}
                target="_blank"
            >
                <SearchEntryWrapper>
                    <ImagePreviews {...props} />
                    <SearchEntryRightSide>
                        <ArtistName {...props} />
                        <ArtistBio {...props} />
                        <Row style={{ marginTop: 'auto', width: '100%' }} bottom between>
                            {children}
                            <Price {...props} />
                        </Row>
                    </SearchEntryRightSide>
                </SearchEntryWrapper>
            </NavLink>
            <Hr style={{ marginTop: 30, marginBottom: 30 }} />
        </li>
    );
};

const EmptySearch = () => {
    const { search } = useLocation();

    return (
        <>
            <NavLink to={'/book-dj' + search}>
                <GreyBox style={{ textAlign: 'center' }}>
                    <h3>Post event to see more DJs</h3>
                    <div style={{ margin: '24px auto 0' }}>
                        <PrimaryButton>Post event</PrimaryButton>
                    </div>
                </GreyBox>
            </NavLink>
            <Hr style={{ marginTop: 30, marginBottom: 30 }} />
        </>
    );
};

const SearchResults = ({ topDjs, form, pagination, loading, setPagination, searchRef }) => {
    const { pathname, search } = useLocation();
    const locationName = form?.locationName?.split(', ')[0];

    useEffect(() => {
        try {
            if (!topDjs.length) {
                trackEmptySearch(locationName);
            }
        } catch (error) {}
    }, [locationName, topDjs.length]);

    const { genres } = form;
    return (
        <Col ref={searchRef} style={{ flexGrow: 1, width: '100%' }}>
            <H2 small style={{ marginBottom: 24 }}>
                DJs in <strong style={{ fontWeight: 700 }}>{locationName}</strong>
            </H2>
            <SearchList>
                {topDjs.map((dj, idx) => (
                    <DJSearchEntry
                        idx={idx}
                        key={dj?.id || idx}
                        {...dj}
                        search={search}
                        loading={loading}
                        filterGenres={genres?.map((s) => s.toLowerCase())}
                    />
                ))}
                {!pagination?.hasNextPage && <EmptySearch />}
            </SearchList>
            {pagination && (
                <Row style={{ marginBottom: 30 }}>
                    <Pagination
                        activePage={pagination.page}
                        ellipsisBuffer={2}
                        onPageChange={(page) => {
                            setPagination((pp) => ({ ...pagination, ...pp, page }));
                        }}
                        totalPages={pagination.totalPages}
                    />
                </Row>
            )}
        </Col>
    );
};

const SearchList = styled.ul`
    padding: 0;
    list-style: none;
    > li {
    }
`;

const SearchEntryRightSide = styled(Col)`
    padding: 12px 15px;
    height: 180px;
    width: 100%;
`;

const SearchEntryWrapper = styled(Row)`
    h3 {
        font-weight: 600;
        font-size: 18px;
        margin-bottom: 0.5em;
    }
    &:hover {
        h3 {
            text-decoration: underline;
        }
    }
    @media only screen and (max-width: 767px) {
        flex-direction: column;
        ${SearchEntryRightSide} {
            padding: 12px 0;
        }
    }
`;

const ImageGrid = styled.ol`
    list-style: none;
    display: grid;
    padding: 0;
    margin: 0;
    grid-gap: 4px;

    border-radius: 0 10px 10px 0;
    overflow: hidden;
    height: 180px;
    width: 366px;
    min-width: 366px;

    ${({ images, singleItem }) => {
        if (singleItem) {
            return css`
                width: 180px;
                min-width: 180px;
                grid-template:
                    'a a'
                    'a a';
            `;
        }

        switch (images) {
            case 1:
                return css`
                    grid-template:
                        'a a b b'
                        'a a b b';
                `;
            case 2:
                return css`
                    grid-template:
                        'a a b b'
                        'a a c c';
                `;
            case 3:
                return css`
                    grid-template:
                        'a a b b'
                        'a a c d';
                `;

            default:
                return css`
                    grid-template:
                        'a a b c'
                        'a a d e';
                `;
        }
    }}

    li {
        position: relative;
        background-color: #f7f9fc;

        > * {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            cursor: pointer !important;
        }
        ${Pill} {
            top: auto;
            bottom: 1em;
            left: 1em;
            width: auto;
            height: auto;
            text-transform: capitalize;
            letter-spacing: 0;
            font-weight: 500;
            font-size: 10px;
        }
    }
    li.with-border {
        border: 0.5px solid rgba(207, 215, 223, 0.5);
        border-radius: 0 10px 10px 0;
        pointer-events: none;
        margin-bottom: -25px;
    }
    li:first-child {
        grid-area: a;
        border-radius: 10px 0 0 10px;
        overflow: hidden;
        border: 0.5px solid rgba(207, 215, 223, 0.5);
    }

    li:nth-child(2) {
        grid-area: b;
    }
    li:nth-child(3) {
        grid-area: c;
    }

    li:nth-child(4) {
        grid-area: d;
    }
    li:nth-child(5) {
        grid-area: e;
    }
    img,
    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    @media only screen and (max-width: 1191px) and (min-width: 1023px) {
        width: 180px;
        min-width: 180px;
        grid-template:
            'a a'
            'a a';
        li {
            display: none;
        }
        li:first-child {
            display: block;
        }
    }
    @media only screen and (max-width: 767px) {
        width: 100%;
        min-width: 100%;
        height: 46vw;
    }
`;

export default SearchResults;
