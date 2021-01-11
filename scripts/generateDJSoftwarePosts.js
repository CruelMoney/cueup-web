/* eslint-disable security/detect-non-literal-regexp */

const fs = require('fs');
const { processUpload } = require('./s3');
const { getAllPosts, searchPosts, closeDb, getDB } = require('./blogDatabase');
const defaultList = require('./blogPostTemplates/default_list');
const songList = require('./blogPostTemplates/song_list');

/* eslint-disable camelcase */

const postsFilePath = './src/shared/routes/Blog/automated_posts.json';

const getGeneratedPosts = async () => {
    const data = fs.readFileSync(postsFilePath);
    return JSON.parse(data);
};

const generatePosts = async () => {
    const posts = await getAllPosts();
    const data = await getGeneratedPosts();

    for (const post of posts) {
        if (!post.shared_to_buffer) {
            const idx = data.findIndex((p) => p.slug === post.slug);
            const newPost = await generatePost(post);
            if (idx) {
                data[idx] = newPost; // override old post
            } else {
                data.push(newPost);
            }
        }
    }

    await new Promise((resolve, reject) => {
        fs.writeFile(postsFilePath, JSON.stringify(data), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

    await closeDb();
};

const replaceTemplateVariables = (string, entries) => {
    return string.replace(/{{list_count}}/g, entries.length);
};

const postTemplates = {
    default: defaultList,
    song_list: songList,
};

const generatePost = async (entry) => {
    const {
        id,
        data_table,
        filter_column,
        display_columns_labels,
        display_columns,
        filter_search,
    } = entry;
    // get rows from db
    const entries = await searchPosts({ data_table, filter_column, filter_search });

    if (!entry.og_image || !entry.twitter_image || !entry.insta_image) {
        const imageUrl = `http://localhost:8500/sharing-previews/post/${id}/1200/630`;
        const ogImageUrl = `http://localhost:8500/sharing-previews/post/${id}/1200/630?template=text`;
        const instagramImageUrl = `http://localhost:8500/sharing-previews/post/${id}/1080/1080`;

        const { publicPath: image } = await processUpload({
            url: imageUrl,
            key: 'social_images/' + id + '_1200_630.jpeg',
        });
        const { publicPath: og_image } = await processUpload({
            url: ogImageUrl,
            key: 'social_images/' + id + '_1200_630_text.jpeg',
        });
        const { publicPath: insta_image } = await processUpload({
            url: instagramImageUrl,
            key: 'social_images/' + id + '_1080_1080.jpeg',
        });

        entry.image = image;
        entry.og_image = og_image;
        entry.insta_image = insta_image;
        entry.twitter_image = og_image;

        const updateQuery = `
            UPDATE post SET 
                image = "${entry.image}",
                og_image = "${entry.og_image}",
                insta_image = "${entry.insta_image}",
                twitter_image = "${entry.twitter_image}"
            WHERE id = ${entry.id};
        `;
        const db = await getDB();
        await db.run(updateQuery);
    }

    const templateRender = postTemplates[entry.content_type] || postTemplates.default;

    return {
        id: entry.id,
        title: replaceTemplateVariables(entry.title, entries),
        slug: entry.slug,
        excerpt: entry.excerpt,
        published_date: entry.created_at,
        updated_date: entry.updated_at,
        author: entry.author,
        author_image: entry.author_image,
        thumbnail_url: entry.image,
        og_image: entry.og_image,
        insta_image: entry.insta_image,
        twitter_image: entry.twitter_image,
        thumbnail_alt: entry.image_alt,
        tag: entry.tags,
        category: entry.category,
        content: templateRender(entry, entries),
    };
};

generatePosts();
