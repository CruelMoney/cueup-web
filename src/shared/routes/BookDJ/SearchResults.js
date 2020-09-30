import React from 'react';
import styled from 'styled-components';
import { InlineIcon } from '@iconify/react';
import pinIcon from '@iconify/icons-ion/location-sharp';
import { Col, Pill, Row, RowWrap } from 'components/Blocks';
import { BodySmall, H2 } from 'components/Text';
import GracefullImage from 'components/GracefullImage';
import GracefullVideo from 'components/GracefullVideo';
import { ProFeature } from 'components/FormComponents';

const ImagePreviews = ({ media, picture, playingLocations }) => {
    const renderItems = media.edges || [];

    const placeholder = 4 - renderItems.length;

    const locationName = playingLocations[0]?.name;

    return (
        <ImageGrid>
            <li>
                <GracefullImage src={picture.path} />

                <Pill>
                    <InlineIcon icon={pinIcon} style={{ marginRight: 3, marginBottom: -1 }} />
                    {locationName}
                </Pill>
            </li>
            {renderItems.map((m, idx) => (
                <li key={m.id}>
                    {m.type === 'VIDEO' ? (
                        <GracefullVideo src={m.path} loop autoPlay muted playsInline animate />
                    ) : (
                        <GracefullImage src={m.path} animate />
                    )}
                </li>
            ))}
            {Array.from({ length: placeholder }).map((_, idx) => (
                <li key={idx} />
            ))}
        </ImageGrid>
    );
};

const ArtistName = ({ artistName, userMetadata, appMetadata }) => {
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
`;

const ArtistBio = ({ userMetadata, genres }) => {
    const { bio } = userMetadata;

    const maxNum = genres.length > 7 ? 6 : 7;
    const renderGenres = genres.slice(0, maxNum);
    const missing = genres.length - renderGenres.length;

    return (
        <>
            <BioText>{bio}</BioText>
            <RowWrap style={{ margin: '9px 0' }}>
                {renderGenres.map((g) => (
                    <Pill key={g} style={{ marginRight: 4 }}>
                        {g}
                    </Pill>
                ))}
                {missing > 1 && <Pill>...{missing} more</Pill>}
            </RowWrap>
        </>
    );
};

const SearchEntry = (props) => {
    return (
        <SearchEntryWrapper>
            <ImagePreviews {...props} />
            <SearchEntryRightSide>
                <ArtistName {...props} />
                <ArtistBio {...props} />
            </SearchEntryRightSide>
        </SearchEntryWrapper>
    );
};

const SearchResults = ({ topDjs }) => {
    console.log({ topDjs });
    return (
        <Col>
            <H2 small style={{ marginBottom: 24 }}>
                DJs in <strong style={{ fontWeight: 700 }}>Copenhagen</strong>
            </H2>
            {topDjs.map((dj) => (
                <SearchEntry key={dj.id} {...dj} />
            ))}
        </Col>
    );
};

const SearchEntryRightSide = styled(Col)`
    padding: 15px;
`;

const SearchEntryWrapper = styled(Row)`
    margin-bottom: 30px;

    h3 {
        font-weight: 600;
        font-size: 18px;
        margin-bottom: 0.5em;
    }
`;

const ImageGrid = styled.ol`
    list-style: none;
    display: grid;
    padding: 0;
    margin: 0;
    grid-gap: 4px;
    grid-template:
        'a a b c'
        'a a d e';

    height: 180px;
    width: 366px;
    min-width: 366px;
    li {
        position: relative;
        background-color: #f7f9fc;

        :after {
            content: '';
            display: block;
            padding-bottom: 100%;
        }
        > * {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
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
    li:first-child {
        grid-area: a;
        border: 0.5px solid rgba(207, 215, 223, 0.5);
        border-radius: 10px 0 0 10px;
        overflow: hidden;
    }
    li:nth-child(3) {
        border-radius: 0px 10px 0 0px;
        overflow: hidden;
    }
    li:nth-child(5) {
        border-radius: 0px 0 10px 0px;
        overflow: hidden;
    }
    img,
    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

export default SearchResults;
