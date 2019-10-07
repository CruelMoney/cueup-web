import ReactPixel from 'react-facebook-pixel';
import * as Sentry from '@sentry/browser';
import { useMutation } from 'react-apollo';
import { useState } from 'react';
import { CHECK_DJ_AVAILABILITY, CREATE_EVENT } from 'components/common/RequestForm/gql';
import GeoCoder from '../utils/GeoCoder';
import * as tracker from '../utils/analytics/autotrack';

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

export function postEvent(event, mutate, callback) {
    return async (dispatch) => {
        try {
            const { error } = await mutate({
                variables: event,
            });
            callback(error);
            if (!error) {
                tracker.trackEventPosted();
                ReactPixel.track('Lead');
            }
        } catch (error) {
            callback(error);
        }
    };
}

export const useCheckDjAvailability = ({ locationName, date }) => {
    const [error, setError] = useState();
    const [mutate, { loading, error: apolloError }] = useMutation(CHECK_DJ_AVAILABILITY);

    const check = async () => {
        try {
            if (!__DEV__) {
                try {
                    tracker.trackCheckAvailability();
                    ReactPixel.track('Search');
                } catch (error) {
                    Sentry.captureException(error);
                }
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
            const variables = {
                date,
                location: geoData.location,
            };
            console.log({ variables });

            const { data = {} } = await mutate({ variables });
            return {
                result: data.djsAvailable,
                data: {
                    timeZoneId: geoResult.timeZoneId,
                    location,
                },
            };
        } catch (err) {
            Sentry.captureException(err);
            setError(err.message);
        }
    };

    return [check, { loading, error: error || apolloError }];
};

export const useCreateEvent = (theEvent) => {
    const [mutate, { loading, error }] = useMutation(CREATE_EVENT);

    const doMutate = async (variables) => {
        try {
            await mutate({
                variables: {
                    ...theEvent,
                    ...variables,
                },
            });
            if (__DEV__) {
                tracker.trackEventPosted();
                ReactPixel.track('Lead');
            }
        } catch (error) {
            Sentry.captureException(error);
        }
    };

    return [doMutate, { loading, error }];
};
