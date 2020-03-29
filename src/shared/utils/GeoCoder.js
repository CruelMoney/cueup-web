import { Environment } from '../constants/constants';

export default {
    codeAddress: function (address, callback) {
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
    },

    getTimeZone: function ({ lng, lat }) {
        return new Promise((resolve, reject) => {
            fetch(
                `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${
                    Date.now() / 1000
                }&key=${Environment.GOOGLE_API_KEY}`
            )
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                    reject('Could not get timezone');
                })
                .then((data) => {
                    if (data.status === 'OK') {
                        resolve(data);
                    } else {
                        reject('Could not get timezone: ' + data.status);
                    }
                })
                .catch((err) => {
                    reject('Could not get timezone');
                });
        });
    },
};
