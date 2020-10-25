import * as Sentry from '@sentry/react';
import { useMutation } from '@apollo/client';
import { useCallback, useState } from 'react';
import { useHistory } from 'react-router';
import { CHECK_DJ_AVAILABILITY, CREATE_EVENT } from 'components/common/RequestForm/gql';
import { trackCheckAvailability, trackEventPosted } from 'utils/analytics';
import { useLazyLoadScript } from 'components/hooks/useLazyLoadScript';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes } from 'constants/locales/appRoutes';
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
                    reject('The location could not be found, try another city.');
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
                    timeZone: geoResult.timeZoneId,
                };

                const moment = await import('moment-timezone');
                const momentDate = date ? moment.default(date) : moment.default().add(4, 'months');

                const { timeZone, location } = geoData;

                const newMoment = moment.tz(
                    momentDate.format('YYYY-MM-DDTHH:mm:ss'),
                    'YYYY-MM-DDTHH:mm:ss',
                    timeZone
                );

                const variables = {
                    date,
                    location,
                };

                const { data = {} } = await mutate({ variables });

                return {
                    result: data?.djsAvailable,
                    date: newMoment.toDate(),
                    timeZone,
                    location,
                };
            } catch (err) {
                console.log(err);
                Sentry.captureException(err);
                setError(err);
                return {
                    result: false,
                    error: err,
                };
            } finally {
                setLoading(false);
            }
        },
        [mutate, loadGoogleMaps]
    );

    return [check, { loading, error: error }];
};

const parseEventForm = ({ budget, eventTypes, guestsCount, ...rest }) => ({
    ...rest,
    guestsCount: parseInt(guestsCount || 0),
    eventType: eventTypes ? eventTypes : null,
    maxPrice: budget?.value,
});

export const useCreateEvent = (theEvent) => {
    const history = useHistory();
    const { translate } = useTranslate();
    const [mutate, { loading, error, ...rest }] = useMutation(CREATE_EVENT);

    let innerError;

    const doMutate = async (variables) => {
        try {
            if (!isDevelopment) {
                trackEventPosted();
            }
            const { data } = await mutate({
                variables: parseEventForm({
                    ...theEvent,
                    ...variables,
                }),
            });

            if (data?.createEvent) {
                const { id, hash } = data?.createEvent;
                history.push(translate(appRoutes.event) + `/${id}/${hash}/overview`);
            }

            return data;
        } catch (error) {
            console.log({ error });
            innerError = error;
            Sentry.captureException(error);
            return { error };
        }
    };

    return [doMutate, { loading, error: error || innerError, ...rest }];
};
