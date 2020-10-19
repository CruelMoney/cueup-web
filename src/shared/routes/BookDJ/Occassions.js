import React from 'react';

import { Container } from 'components/Blocks';
import { Body, H2, H3 } from 'components/Text';
import { GracefullPicture } from 'components/GracefullImage';

import { CustomSection, ImageWrapper, ResponsiveCell, ResponsiveRow } from './Components';
import firstWeddingDance from './assets/first_wedding_dance_of_newlywed.webp';
import birthdayParty from './assets/birthday_party.webp';
import officeParty from './assets/office_party.webp';

import firstWeddingDanceJPG from './assets/first_wedding_dance_of_newlywed.jpg';
import birthdayPartyJPG from './assets/birthday_party.jpg';
import officePartyJPG from './assets/office_party.jpg';

const occationData = [
    {
        src: firstWeddingDance,
        jpg: firstWeddingDanceJPG,
        alt: 'First wedding dance with glitter',
        title: 'Weddings',
        description: 'Wedding DJs that knows how to create a magical night.',
        value: 'wedding',
    },
    {
        src: officeParty,
        jpg: officePartyJPG,
        alt: 'First wedding dance with glitter',
        title: 'Corporate events',
        description: 'DJs that knows exactly how a corporate event should be pulled off.',
        value: 'corporate',
    },
    {
        src: birthdayParty,
        jpg: birthdayPartyJPG,
        alt: 'First wedding dance with glitter',
        title: 'Birthday parties',
        description: 'DJs for birthdays, anniversaries, and other private events.',
        value: 'birthday',
    },
];

const OccationItem = ({ src, jpg, alt, title, description, idx, ...props }) => {
    return (
        <ResponsiveCell
            ariaLabel={description}
            itemProp="itemListElement"
            itemScope=" "
            itemType="https://schema.org/ListItem"
            {...props}
        >
            <meta itemProp="position" content={idx + 1} />
            <meta itemProp="name" content={title} />
            <meta itemProp="description" content={description} />
            <meta itemProp="image" content={src} />
            <ImageWrapper>
                <GracefullPicture lazyload>
                    <source srcSet={src} type="image/webp" />
                    <source srcSet={jpg} type="image/jpeg" />
                    <img alt={alt} src={jpg} loading="lazy" />
                </GracefullPicture>
            </ImageWrapper>
            <div className="content">
                <H3 small aria-hidden="true">
                    {title}
                </H3>
                <Body aria-hidden="true">{description}</Body>
            </div>
        </ResponsiveCell>
    );
};

const Occasions = ({ onClick, v2 }) => {
    return (
        <CustomSection
            style={{
                marginTop: v2 ? 60 : 0,
                marginBottom: v2 ? 0 : 60,
            }}
        >
            <Container>
                {!v2 && (
                    <>
                        <H2 small>DJs for every occasion</H2>
                        <Body>Get a DJ that knows what you need.</Body>
                    </>
                )}
                <ResponsiveRow>
                    {occationData.map((item, idx) => (
                        <OccationItem
                            key={idx}
                            idx={idx}
                            onClick={onClick({
                                eventTypes: [item.value],
                            })}
                            v2={v2}
                            {...item}
                        />
                    ))}
                </ResponsiveRow>
            </Container>
        </CustomSection>
    );
};

export default Occasions;
