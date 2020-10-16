import * as Sentry from '@sentry/react';
import { useMutation } from '@apollo/client';
import { useCallback, useState } from 'react';
import { CHECK_DJ_AVAILABILITY, CREATE_EVENT } from 'components/common/RequestForm/gql';
import { trackCheckAvailability, trackEventPosted } from 'utils/analytics';
import { useLazyLoadScript } from 'components/hooks/useLazyLoadScript';
import GeoCoder from '../utils/GeoCoder';

const isDevelopment = process.env.NODE_ENV === 'development';

export const getLocation = (location) => {
    return new Promise((resolve, reject) => {
        if (location.toUpperCase() === 'CURRENT LOCATION') {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            position: {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            },
                        });
                    },
                    (err) => reject('Current location could not be found. Please enter the city.')
                );
            } else {
                reject('Current location not supported in this browser. Please enter the city.');
            }
        } else {
            GeoCoder.codeAddress(location, (geoResult) => {
                if (geoResult.error) {
                    reject('The location could not be found, try another city');
                } else {
                    GeoCoder.getTimeZone(geoResult.position)
                        .then((res) => {
                            resolve({ ...geoResult, ...res });
                        })
                        .catch((err) => {
                            console.log({ err });
                            reject(err);
                        });
                }
            });
        }
    });
};

export const useCheckDjAvailability = () => {
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [mutate, { error: apolloError }] = useMutation(CHECK_DJ_AVAILABILITY);

    const [loadGoogleMaps] = useLazyLoadScript(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAQNiY4yM2E0h4SfSTw3khcr9KYS0BgVgQ&libraries=geometry,places,visualization,geocode'
    );

    const check = useCallback(
        async ({ locationName, date }) => {
            try {
                await loadGoogleMaps();
                setLoading(true);
                try {
                    trackCheckAvailability(locationName);
                } catch (error) {
                    Sentry.captureException(error);
                }

                const geoResult = await getLocation(locationName);

                const geoData = {
                    location: {
                        latitude: geoResult.position.lat,
                        longitude: geoResult.position.lng,
                        name: locationName,
                    },
                    timeZoneId: geoResult.timeZoneId,
                };

                const moment = await import('moment-timezone');
                const momentDate = moment.default(date);

                const { timeZoneId, location } = geoData;

                const newMoment = moment.tz(
                    momentDate.format('YYYY-MM-DDTHH:mm:ss'),
                    'YYYY-MM-DDTHH:mm:ss',
                    timeZoneId
                );

                const variables = {
                    date,
                    location,
                };

                const { data = {} } = await mutate({ variables });

                return {
                    result: data?.djsAvailable,
                    date: newMoment.toDate(),
                    timeZoneId,
                    location,
                };
            } catch (err) {
                console.log(err);
                Sentry.captureException(err);
                setError(err);
                return {
                    result: false,
                };
            } finally {
                setLoading(false);
            }
        },
        [mutate]
    );

    return [check, { loading, error: error }];
};

const parseEventForm = ({ budget, eventTypes, ...rest }) => ({
    ...rest,
    eventType: eventTypes ? Object.keys(eventTypes) : null,
    maxPrice: budget?.value,
});

export const useCreateEvent = (theEvent) => {
    const [mutate, { loading, error, ...rest }] = useMutation(CREATE_EVENT);

    let innerError;

    const doMutate = async (variables) => {
        try {
            if (!isDevelopment) {
                trackEventPosted();
            }
            return await mutate({
                variables: parseEventForm({
                    ...theEvent,
                    ...variables,
                }),
            });
        } catch (error) {
            console.log({ error });
            innerError = error;
            Sentry.captureException(error);
            return { error };
        }
    };

    return [doMutate, { loading, error: error || innerError, ...rest }];
};
