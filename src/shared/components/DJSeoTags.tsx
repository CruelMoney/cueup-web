import React from 'react';
import { Helmet } from 'react-helmet-async';
import { helmetJsonLdProp } from 'react-schemaorg';
import { EntertainmentBusiness } from 'schema-dts';
import { appRoutes } from 'constants/locales/appRoutes';
import useTranslate from './hooks/useTranslate';
import { useServerContext } from './hooks/useServerContext';

export interface DJSeoProps {
    id: string;
    artistName: string;
    permalink: string;
    playingLocation: any;
    picture: any;
    userMetadata: any;
}

export const DJSeoTags: React.FC<DJSeoProps> = ({
    id,
    permalink,
    artistName,
    playingLocation,
    picture,
    userMetadata,
}) => {
    const { environment } = useServerContext();
    const { translate } = useTranslate();

    const url = `${environment.WEBSITE_URL}${translate(appRoutes.user)}/${permalink}/overview`;
    const { name, latitude, longitude } = playingLocation || {};
    const { bio } = userMetadata || {};

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
                }),
            ]}
        />
    );
};
