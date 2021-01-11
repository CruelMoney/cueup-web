import Queue from 'bull';
import fetch from 'node-fetch';
import { shuffle } from './blogUtils';

const { getDB } = require('./blogDatabase');

const uploadNewestBlogPosts = async (_job, done) => {
    const db = await getDB();
    // get all posts that have not been uploaded

    const posts = await db.all(
        `
            SELECT *
            FROM post
            WHERE shared_to_buffer = false AND created_at < datetime('now','-1 day') AND created_at > datetime('now','-3 day')
        `
    );

    console.log('Uploading ' + posts.length + ' posts to buffer');

    const failed = [];

    // upload each post
    for (const post of posts) {
        try {
            await uploadToAll(post);
            // set shared flag
            await db.run(`
                UPDATE post SET 
                shared_to_buffer = true
                WHERE id = ${post.id};
            `);
        } catch (error) {
            console.log(error);
            failed.push(post.id);
        }
    }
    if (failed.length) {
        done('Upload failed for: ' + failed.join(', '));
    }

    done();

    console.log('Done with buffer uploading');
};

const getInstagramPostText = ({ title, excerpt, url }) => `
${title}
-
${excerpt}
-
Link in bio 🔗
_
${getHashTags().join(' ')}
`;

const getTwitterPostText = ({ excerpt, url }) => `
${excerpt.slice(0, 250)}...
${url}
`;

const getFacebookPostText = ({ excerpt, url }) => `
${excerpt}
${url}
`;

const uploadToAll = async (entry) => {
    entry.url = `https://cueup.io/blog/${entry.slug}`;

    const webhookData = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: entry.id,
            title: entry.title,
            excerpt: entry.excerpt,
            og_image: entry.og_image,
            insta_image: entry.insta_image,
            twitter_image: entry.twitter_image,
            thumbnail_alt: entry.image_alt,
            tag: entry.tags,
            category: entry.category,

            instagram_text: getInstagramPostText(entry),
            facebook_text: getFacebookPostText(entry),
            twitter_text: getTwitterPostText(entry),
        }),
    };

    // instagram hook
    await fetch('https://hooks.zapier.com/hooks/catch/2565545/o0hyer6/', webhookData);
    // facebook hook
    await fetch('https://hooks.zapier.com/hooks/catch/2565545/o0hb4or/', webhookData);
    // twitter hook
    await fetch('https://hooks.zapier.com/hooks/catch/2565545/o0hbddl/', webhookData);
};

export const setupSocialMediaAutomation = async () => {
    console.log('START SOCIAL MEDIA AUOMATION');

    const uploadToBufferQueue = new Queue('Upload to Buffer', process.env.REDIS_URL);
    uploadToBufferQueue.process(uploadNewestBlogPosts);

    uploadToBufferQueue.add({}, { repeat: { cron: '0 0 * * *' } });
};

const getHashTags = () => {
    return shuffle([
        '#turntables',
        '#WeAreUrbanHollywood',
        '#hosts',
        '#recordplayer',
        '#vinyls',
        '#vinyloftheday',
        '#vinyljunkie',
        '#indieartist',
        '#indiemusic',
        '#records',
        '#reggae',
        '#abletonlive',
        '#akai',
        '#logicprox',
        '#instrumentals',
        '#traktor',
        '#nativeinstruments',
        '#birthday',
        '#partytime',
        '#drinks',
        '#goodtimes',
        '#celebrate',
        '#festa',
        '#celebration',
        '#goodtime',
        '#remix',
        '#nightclub',
        '#fiesta',
        '#goodmusic',
        '#partymusic',
        '#happybirthday',
        '#memories',
        '#cdj',
        '#scratch',
        '#deejay',
        '#rekordbox',
        '#homestudio',
        '#maschine',
        '#beatmaker',
        '#cdj2000',
        '#moombahton',
        '#spinnin',
        '#lic',
        '#dyro',
        '#wasted',
        '#label',
        '#ravelife',
        '#ableton',
        '#studiolife',
        '#protools',
        '#producerlife',
        '#flstudio',
        '#musicproducer',
        '#musicproduction',
        '#production',
        '#nightlife',
        '#club',
        '#plur',
        '#dubstep',
        '#vinylporn',
        '#vinylcollection',
        '#nowspinning',
        '#vinylcollector',
        '#beats',
        '#serato',
        '#seratodj',
        '#mastering',
        '#studioporn',
        '#ssl',
        '#audioengineer',
        '#recordingengineer',
        '#gearporn',
        '#studios',
        '#logicpro',
        '#mix',
        '#engineer',
        '#tomorrowland',
        '#techno',
        '#event',
        '#trance',
        '#pioneer',
        '#turntable',
        '#recording',
        '#mixing',
        '#recordingstudio',
        '#studioflow',
        '#musicstudio',
        '#mixtape',
        '#festival',
        '#song',
        '#rane',
        '#housemusic',
        '#soundcloud',
        '#pioneerdj',
        '#musiclife',
        '#dancefloor',
        '#instadance',
        '#danceshoes',
        '#djlife',
        '#rave',
        '#vinyl',
        '#dj',
        '#djset',
        '#electro',
        '#edc',
        '#electronicmusic',
        '#edmnation',
        '#studio',
        '#songwriter',
        '#audio',
        '#producers',
        '#edm',
        '#producer',
        '#techhouse',
        '#djs',
        '#deephouse',
        '#edmlife',
        '#edmfamily',
        '#edmlifestyle',
        '#martingarrix',
        '#dancemusic',
        '#hardwell',
        '#djing',
        '#dimitrivegasandlikemike',
        '#rappers',
        '#radio',
        '#progressivehouse',
        '#promoters',
        '#edmmusic',
        '#spinninrecords',
        '#tiesto',
        '#house',
        '#rap',
        '#musician',
        '#trap',
        '#events',
        '#eventplanner',
        '#bass',
        '#eventplanning',
        '#이벤트',
        '#weddingplanner',
        '#catering',
        '#eventprofs',
        '#show',
        '#newmusic',
        '#denon',
        '#music',
        '#denondj',
        '#party',
        '#hifi',
        '#homecinema',
        '#poland',
        '#record',
        '#recordcollection',
        '#denondp300f',
        '#12inch',
        '#dalizensorpico',
        '#denonpma520ae',
        '#denonstore',
        '#singer',
        '#rock',
        '#guitar',
        '#concert',
        '#instamusic',
        '#pop',
        '#bands',
        '#musica',
        '#band',
        '#live',
        '#livemusic',
        '#metal',
        '#songs',
        '#rnb',
        '#rapper',
        '#technics',
        '#turntablism',
        '#clubbing',
    ]).slice(0, 30);
};
