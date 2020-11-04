import React from 'react';
import { Helmet } from 'react-helmet-async';
import { helmetJsonLdProp } from 'react-schemaorg';
import { EntertainmentBusiness, FAQPage, Organization, WebSite } from 'schema-dts';
import { appRoutes } from 'constants/locales/appRoutes';
// @ts-ignore
import logoUrl from '../assets/logo_black.png';
import useTranslate from './hooks/useTranslate';
import { useServerContext } from './hooks/useServerContext';

export interface DJSeoProps {
    id: string;
    artistName: string;
    permalink: string;
    playingLocation: any;
    picture: any;
    userMetadata: any;
    appMetadata: any;
    reviews: any;
}

export interface RatingProps {
    id: string;
    content: string;
    citation: string;
    author: string;
    createdAt: any;
    rating: number;
    title: string;
}

export const DJSeoTags: React.FC<DJSeoProps> = ({
    id,
    permalink,
    artistName,
    playingLocation,
    picture,
    userMetadata,
    appMetadata,
    reviews,
}) => {
    const { environment } = useServerContext();
    const { translate } = useTranslate();

    const url = `${environment.WEBSITE_URL}${translate(appRoutes.user)}/${permalink}/overview`;
    const { name, latitude, longitude } = playingLocation || {};
    const { bio } = userMetadata || {};
    const { rating } = appMetadata || {};
    const reviewCount = reviews?.pageInfo?.totalDocs || 0;
    const extraFields = {};

    if (rating) {
        // @ts-ignore
        extraFields.aggregateRating = {
            '@type': 'AggregateRating',
            'ratingValue': rating,
            'reviewCount': reviewCount,
            'worstRating': 1,
            'bestRating': 5,
        };
    }

    return (
        <Helmet
            script={[
                helmetJsonLdProp<EntertainmentBusiness>({
                    '@id': id,
                    '@context': 'https://schema.org',
                    '@type': 'EntertainmentBusiness',
                    'name': artistName,
                    'description': bio,
                    'address': name,
                    'geo': {
                        '@type': 'GeoCoordinates',
                        'latitude': latitude,
                        'longitude': longitude,
                    },
                    'image': picture?.path,
                    'url': url,
                    'priceRange': '$$',
                    ...extraFields,
                }),
            ]}
        />
    );
};

export const OrganizationSeo = () => {
    const { t } = useTranslate();
    const { environment } = useServerContext();

    return (
        <Helmet
            script={[
                helmetJsonLdProp<Organization>({
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    'name': 'Cueup DJ Booking',
                    'url': 'https://cueup.io/',
                    'logo': logoUrl,
                    'foundingDate': '2016',
                    'sameAs': [
                        'https://www.facebook.com/cueup.dj.booking',
                        'https://twitter.com/CueupDK',
                        'https://www.instagram.com/cueup.dj.booking',
                    ],
                }),

                helmetJsonLdProp<WebSite>({
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    // @ts-ignore
                    'url': environment.WEBSITE_URL,
                    'potentialAction': {
                        '@type': 'SearchAction',
                        'target': `${environment.WEBSITE_URL}${t(
                            appRoutes.search
                        )}?locationName={search_term_string}`,
                        // @ts-ignore
                        'query-input': 'required name=search_term_string',
                    },
                }),
            ]}
        />
    );
};

export interface FAQProps {
    faq: any;
}
export const FAQSeoTag = ({ faq }) => {
    return (
        <Helmet
            script={[
                helmetJsonLdProp<FAQPage>({
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    'mainEntity': faq.map(({ q, a }) => ({
                        '@type': 'Question',
                        'name': q,
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': a,
                        },
                    })),
                }),
            ]}
        />
    );
};

// // not used for now. need to specify
// export const ReviewSeoTag: React.FC<RatingProps> = ({
//     id,
//     content,
//     citation,
//     author,
//     createdAt,
//     rating,
//     title,
// }) => {
//     return (
//         <Helmet
//             script={[
//                 helmetJsonLdProp<Review>({
//                     '@context': 'https://schema.org',
//                     '@type': 'Review',
//                     '@id': id,
//                     'reviewRating': {
//                         '@type': 'Rating',
//                         'ratingValue': rating,
//                     },
//                     'name': title,
//                     'author': {
//                         '@type': 'Person',
//                         'name': author || citation,
//                     },
//                     'datePublished': createdAt,
//                     'reviewBody': content,
//                 }),
//             ]}
//         />
//     );
// };
