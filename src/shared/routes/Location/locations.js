import slugify from 'slugify';
import cities from './cities.json';

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
