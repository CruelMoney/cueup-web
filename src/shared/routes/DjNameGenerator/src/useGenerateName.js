import { useState, useCallback } from 'react';
import artists from './artists.json';
import hiphop from './hiphop.json';
import adjectives from './adjectives.json';
import blacklist from './blacklist.json';

const splittedArtists = artists
    .flatMap((artist) => {
        const names = artist.split(' ');
        // only use last name
        if (names.length === 2) {
            return [names[1]];
        }
        return names;
    }) // split artist names
    .filter((a) => !blacklist.includes(a.toUpperCase())); // filter normal words

const splittedHipHop = hiphop
    .flatMap((word) => [word, ...word.split(' ')]) // split word, but also have original
    .filter((a) => !blacklist.includes(a.toUpperCase())); // filter normal words

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWYZ';

const WORD_LISTS = Object.freeze({
    ADJECTIVES: shuffle(adjectives),
    ARTISTS: shuffle(splittedArtists),
    HIPHOP: shuffle(splittedHipHop),
    EDM: shuffle(splittedHipHop),
});

export const TYPES = Object.freeze({
    ADJECTIVES: 'ADJECTIVES',
    ARTISTS: 'ARTISTS',
    HIPHOP: 'HIPHOP',
    EDM: 'EDM',
    NAME: 'NAME',
});

const KEYS = Object.keys(WORD_LISTS);

const findFromIndex = (list = []) => (idx, predicate) => {
    let item = list.slice(idx).find(predicate);
    if (!item) {
        item = list.find(predicate);
    }
    return item;
};

function* getParts(lists = [], startLetter) {
    const count = lists.length;
    for (let i = 0; i < count; i += 1) {
        const list = lists?.[i] ?? lists[0] ?? WORD_LISTS.ARTISTS;
        const idx = Math.floor(Math.random() * list.length);

        if (startLetter) {
            yield {
                type: KEYS[i],
                value: findFromIndex(list)(idx, (i) => i.toUpperCase().startsWith(startLetter)),
            };
        } else {
            yield { type: KEYS[i], value: list[idx] };
        }
    }
}

function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const useGenerateName = ({ categories = [], sameFirst, nameText }) => {
    const [parts, setParts] = useState([]);

    const getName = () => {
        if (!parts || !parts.length) {
            return 'DJ Name Generator';
        }

        // order based on categories
        const ordered = categories.reduce((acc, c) => {
            const el = parts.find(({ type }) => type === c);
            return el ? [...acc, el] : acc;
        }, []);

        return `DJ ${ordered
            .map(({ value }) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
            .join(' ')}`;
    };

    const generate = useCallback(() => {
        let startLetter;

        if (sameFirst) {
            if (nameText) {
                startLetter = nameText.charAt(0).toUpperCase();
            } else {
                startLetter = characters.charAt(Math.floor(Math.random() * characters.length));
            }
        }

        const parts = [...getParts(Object.values(WORD_LISTS), startLetter)];

        if (nameText) {
            parts.push({ value: nameText, type: TYPES.NAME });
        }

        setParts(parts.filter((p) => !!p.value));
    }, [sameFirst, nameText]);

    return [generate, { name: getName() }];
};

export default useGenerateName;
