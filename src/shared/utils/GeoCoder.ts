import { loadScript } from 'components/hooks/useLazyLoadScript';
import { CustomWindow } from 'global';

declare let window: CustomWindow;

export default {
    codeAddress: async (address) => {
        try {
            await loadScript(
                'https://maps.googleapis.com/maps/api/js?key=AIzaSyAQNiY4yM2E0h4SfSTw3khcr9KYS0BgVgQ&libraries=geometry,places,visualization,geocode'
            );

            return new Promise((resolve, reject) => {
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ address: address }, (results, status) => {
                    if (status === window.google.maps.GeocoderStatus.OK) {
                        const lat = results[0].geometry.location.lat();
                        const lng = results[0].geometry.location.lng();
                        return resolve({ lat: lat, lng: lng });
                    }
                    return reject('Geocode was not successful for the following reason: ' + status);
                });
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    getTimeZone: async ({ lng, lat }) => {
        try {
            const data = await fetch(
                `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${
                    Date.now() / 1000
                }&key=${window.__ENVIRONMENT__.GOOGLE_API_KEY}`
            );

            if (data.ok) {
                const result = await data.json();
                if (result.status === 'OK') {
                    return result;
                }
            }
        } catch (error) {
            console.log(error);
        }
        // fallback to user timezone
        return {
            timeZoneId: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
    },
};
