const fs = require('fs');
const fetch = require('node-fetch');
const slugify = require('slugify');
const postsPath = '../src/shared/routes/Blog/posts.json';

const currentPosts = require(postsPath);

const ENDPOINT = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@cueup';

const parseMediumPost = (post) => ({
    'medium-guid': post.guid,
    'title': post.title,
    'slug': slugify(post.title, {
        replacement: '-',
        lower: true,
    }),
    'excerpt': null,
    'published_date': post.pubDate,
    'updated_date': post.pubDate,
    'author': post.author,
    'thumbnail_url': post.thumbnail,
    'thumbnail_alt': 'thumbnail',
    'tag': post.categories.join(' '),
    'category': 'dj',
    'content': post.content,
});

const updateMediumPosts = async () => {
    const getPosts = async () => {
        try {
            const response = await fetch(ENDPOINT);
            const data = await response.json();
            return data.items;
        } catch (error) {
            console.log(error);
        }
    };

    const writeToFile = async (content) =>
        new Promise((r, e) => {
            fs.writeFile('src/shared/routes/Blog/posts.json', JSON.stringify(content), (err) => {
                if (err) {
                    e(err);
                }
            });
        });

    const mediumPosts = await getPosts();

    let newPosts = mediumPosts.filter(
        (p) => !currentPosts.some((p2) => p2['medium-guid'] === p.guid)
    );

    newPosts = newPosts.map(parseMediumPost);
    const newContent = [...newPosts, ...currentPosts];

    await writeToFile(newContent);
};
updateMediumPosts();
