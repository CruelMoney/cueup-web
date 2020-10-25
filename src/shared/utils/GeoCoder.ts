import { CustomWindow } from 'global';

declare let window: CustomWindow;

export default {
    codeAddress: function (address, callback) {
        try {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: address }, (results, status) => {
                if (status === window.google.maps.GeocoderStatus.OK) {
                    const lat = results[0].geometry.location.lat();
                    const lng = results[0].geometry.location.lng();
                    return callback({ error: null, position: { lat: lat, lng: lng } });
                }
                return callback({
                    error: 'Geocode was not successful for the following reason: ' + status,
                    position: null,
                });
            });
        } catch (error) {
            console.log(error);
            return callback({
                error: 'Geocode was not successful',
                position: null,
            });
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
