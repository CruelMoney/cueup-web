import slugify from 'slugify';
import copenhagen from '../../assets/images/cities/copenhagen.png';
import odense from '../../assets/images/cities/odense.png';
import aarhus from '../../assets/images/cities/aarhus.png';
import defaultImage from '../../assets/images/cities/default.png';
import copenhagenDa from '../../assets/images/cities/copenhagen_da.png';
import odenseDa from '../../assets/images/cities/odense_da.png';
import aarhusDa from '../../assets/images/cities/aarhus_da.png';
import defaultImageDa from '../../assets/images/cities/default_da.png';
import cities from './cities.json';

const locations = {
    denmark: {
        name: 'Denmark',
        image: defaultImage,
        coordinates: {
            lat: 56.35211531,
            lng: 11.01690928,
        },
        cities: {
            copenhagen: {
                name: 'Copenhagen',
                image: copenhagen,
                coordinates: {
                    lat: 55.6760968,
                    lng: 12.5683372,
                },
            },
            odense: {
                name: 'Odense',
                image: odense,
                coordinates: {
                    lat: 55.403756,
                    lng: 10.40237,
                },
            },
            aarhus: {
                name: 'Århus',
                image: aarhus,
                coordinates: {
                    lat: 56.162939,
                    lng: 10.203921,
                },
            },
        },
    },
    danmark: {
        name: 'Danmark',
        image: defaultImageDa,
        coordinates: {
            lat: 56.35211531,
            lng: 11.01690928,
        },
        cities: {
            koebenhavn: {
                name: 'København',
                image: copenhagenDa,
                coordinates: {
                    lat: 55.6760968,
                    lng: 12.5683372,
                },
            },
            odense: {
                name: 'Odense',
                image: odenseDa,
                coordinates: {
                    lat: 55.403756,
                    lng: 10.40237,
                },
            },
            aarhus: {
                name: 'Århus',
                image: aarhusDa,
                coordinates: {
                    lat: 56.162939,
                    lng: 10.203921,
                },
            },
        },
    },
    indonesia: {
        name: 'Indonesia',
        image: defaultImage,
        coordinates: {
            lat: -2.373287,
            lng: 110.294337,
        },
        radius: 300000,
        cities: {
            bali: {
                name: 'Bali',
                image: defaultImage,
                coordinates: {
                    lat: -8.415773,
                    lng: 115.182847,
                },
                radius: 17000,
                noCircle: true,
            },
        },
    },
};

export const locationsNew = {
    denmark: {
        name: 'Denmark',
        image: defaultImage,
        coordinates: {
            lat: 56.35211531,
            lng: 11.01690928,
        },
        subLocations: {
            copenhagen: {
                name: 'Copenhagen',
                image: copenhagen,
                coordinates: {
                    lat: 55.6760968,
                    lng: 12.5683372,
                },
            },
            odense: {
                name: 'Odense',
                image: odense,
                coordinates: {
                    lat: 55.403756,
                    lng: 10.40237,
                },
            },
            aarhus: {
                name: 'Århus',
                image: aarhus,
                coordinates: {
                    lat: 56.162939,
                    lng: 10.203921,
                },
            },
        },
    },
    indonesia: {
        name: 'Indonesia',
        image: defaultImage,
        coordinates: {
            lat: -2.373287,
            lng: 110.294337,
        },
        radius: 300000,
        subLocations: {
            bali: {
                name: 'Bali',
                image: defaultImage,
                coordinates: {
                    lat: -8.415773,
                    lng: 115.182847,
                },
                radius: 17000,
                noCircle: true,
            },
        },
    },
    ukraine: {
        name: 'Ukraine',
        image: defaultImage,
        coordinates: {
            lat: -2.373287,
            lng: 110.294337,
        },
        radius: 300000,
        noCircle: true,
        subLocations: {
            kiev: {
                name: 'Kiev',
                image: defaultImage,
                coordinates: {
                    lat: 50.4547,
                    lng: 30.5238,
                },
                radius: 17000,
            },
            odessa: {
                name: 'Odessa',
                image: defaultImage,
                coordinates: {
                    lat: -8.415773,
                    lng: 115.182847,
                },
                radius: 17000,
            },
        },
    },
};

const countries = cities.results.reduce((acc, city) => {
    const slug = slugify(city.country, {
        replacement: '-',
        lower: true,
    });
    const existing = acc[slug];

    city.slug = slugify(city.cityascii, {
        replacement: '-',
        lower: true,
    });

    if (existing) {
        acc[slug].cities.push(city);
        return acc;
    }

    return {
        ...acc,
        [slug]: {
            name: city.country,
            cities: [city],
        },
    };
}, {});

export { countries };

export default locations;
