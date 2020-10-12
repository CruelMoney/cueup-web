import React from 'react';
import styled, { css } from 'styled-components';
import { InlineIcon } from '@iconify/react';
import pinIcon from '@iconify/icons-ion/location-sharp';
import { NavLink, useLocation } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { Col, Pill, Row, RowWrap } from 'components/Blocks';
import { BodyBold, BodySmall, H2 } from 'components/Text';
import GracefullImage from 'components/GracefullImage';
import GracefullVideo from 'components/GracefullVideo';
import { ProFeature } from 'components/FormComponents';
import { appRoutes } from 'constants/locales/appRoutes';
import useTranslate from 'components/hooks/useTranslate';
import Map from '../../components/common/Map';
import Pagination from './Pagination';

const loadingGraceStyle = {
    height: '100%',
    width: '100%',
    borderRadius: 0,
    lineHeight: '2em',
};

const ImagePreviews = ({ media, picture, playingLocations, loading }) => {
    const renderItems = media.edges || [];

    const location = playingLocations[0];

    let imagecount = renderItems.length || 1;
    if (loading) {
        imagecount = 4;
    }

    return (
        <ImageGrid images={imagecount}>
            <li>
                {loading ? (
                    <Skeleton style={loadingGraceStyle} />
                ) : (
                    <GracefullImage src={picture.path} />
                )}

                {!loading && (
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

            {!loading && !renderItems.length && (
                <li className="with-border">
                    <Map
                        zoomScaler={150}
                        hideRoads
                        hideNames
                        radius={location?.radius}
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
            {artistName || userMetadata?.firstName}
            {appMetadata?.isPro && (
                <ProFeature small disabled>
                    Pro
                </ProFeature>
            )}
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

const ArtistBio = ({ userMetadata, genres, loading }) => {
    if (loading) {
        return <Skeleton count={3} height={'1em'} style={{ height: 100 }} width={300} />;
    }

    const { bio } = userMetadata;

    const maxNum = genres.length > 5 ? 4 : 5;
    const renderGenres = genres.slice(0, maxNum);
    const missing = genres.length - renderGenres.length;

    return (
        <>
            <BioText>{bio}</BioText>
            <RowWrap style={{ margin: '9px 0' }}>
                {renderGenres.map((g) => (
                    <Pill key={g} style={{ marginRight: 4, marginBottom: 4 }}>
                        {g}
                    </Pill>
                ))}
                {missing > 1 && <Pill>...{missing} more</Pill>}
            </RowWrap>
        </>
    );
};

const Price = ({ loading }) => {
    if (loading) {
        return (
            <BodyBold style={{ fontSize: 16, marginTop: 'auto', display: 'block' }}>
                <Skeleton width={80} />
            </BodyBold>
        );
    }
    return (
        <BodyBold style={{ fontSize: 16, marginTop: 'auto', display: 'block' }}>
            Request Price
        </BodyBold>
    );
};

const SearchEntry = (props) => {
    const { translate } = useTranslate();
    const route = `${translate(appRoutes.user)}/${props.permalink}/overview`;

    return (
        <NavLink
            to={route}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                marginBottom: '30px',
            }}
        >
            <SearchEntryWrapper>
                <ImagePreviews {...props} />
                <SearchEntryRightSide>
                    <ArtistName {...props} />
                    <ArtistBio {...props} />
                    <Price {...props} />
                </SearchEntryRightSide>
            </SearchEntryWrapper>
        </NavLink>
    );
};
const SearchResults = ({ topDjs, form, pagination, loading, setPagination }) => {
    const { pathname } = useLocation();

    return (
        <Col>
            <H2 small style={{ marginBottom: 24 }}>
                DJs in{' '}
                <strong style={{ fontWeight: 700 }}>{form?.locationName?.split(', ')[0]}</strong>
            </H2>
            {topDjs.map((dj) => (
                <SearchEntry key={dj.id} {...dj} loading={loading} />
            ))}
            {pagination && (
                <Row style={{ marginBottom: 30 }}>
                    <Pagination
                        activePage={pagination.page}
                        ellipsisBuffer={2}
                        onPageChange={(page) => {
                            window.scroll({
                                top: 0,
                                left: 0,
                                behavior: 'smooth',
                            });
                            setPagination((pp) => ({ ...pagination, ...pp, page }));
                        }}
                        totalPages={pagination.totalPages}
                        hrefConstructor={(page) => `${pathname}?page=${page}`}
                    />
                </Row>
            )}
        </Col>
    );
};

const SearchEntryRightSide = styled(Col)`
    padding: 12px 15px;
    height: 180px;
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

    ${({ images }) => {
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
            top: 1em;
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
`;

export default SearchResults;
