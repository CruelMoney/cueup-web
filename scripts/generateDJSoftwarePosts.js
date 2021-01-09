/* eslint-disable security/detect-non-literal-regexp */

const fs = require('fs');
const slugify = require('slugify');
const { processUpload } = require('./s3');
const { getAllPosts, searchPosts, closeDb, getDB } = require('./blogDatabase');

/* eslint-disable camelcase */

const generatePosts = async () => {
    const posts = await getAllPosts();
    const data = [];
    for (const post of posts) {
        data.push(await generatePost(post));
    }

    await new Promise((resolve, reject) => {
        fs.writeFile(
            './src/shared/routes/Blog/automated_posts.json',
            JSON.stringify(data),
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });

    await closeDb();
};

const getentrySlug = ({ num, title }) => {
    return (
        num +
        '-' +
        slugify(title, {
            replacement: '-',
            lower: true,
        })
    );
};

function isURL(str) {
    const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$',
        'i'
    ); // fragment locator
    return !!pattern.test(str);
}

const getValueHtml = (v) => {
    let value = v;
    try {
        value = JSON.parse(v);
    } catch (error) {}

    if (isURL(value)) {
        return `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>`;
    }

    if (typeof value === 'string') {
        return `<b>${value}</b>`;
    }

    if (Array.isArray(value)) {
        return getValueHtml(value.join(', '));
    }

    return '';
};

const getTOC = (entries, header) => {
    return `     
        <div id="toc_container">
            ${header ? `<h3>${header}</h3>` : ''}
            <ol class="toc_list">
            ${entries
                .map(
                    (e, idx) =>
                        `<li><a href="#${getentrySlug({ num: idx + 1, title: e.title })}">${
                            idx + 1
                        }. ${e.title}</a></li>`
                )
                .join('')}
            </ol>
        </div>
    `;
};

const getEntryHtmlMarkup = ({ num, display_columns_labels, display_columns, entry }) => {
    const { title } = entry;

    const slug = getentrySlug({ num, title });

    const columns = JSON.parse(display_columns);
    const columnLabels = JSON.parse(display_columns_labels);

    return `
        <h2 id="${slug}">${num}. ${title}</h2>
        <ul>
            ${columns
                .map(
                    (c, idx) => `
                    <li>${columnLabels[idx]}: ${getValueHtml(entry[c], title)}</li>
                `
                )
                .join('')}
        </ul>
    `;
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
        const ogImageUrl = `http://localhost:8500/sharing-previews/post/${id}/1200/630?template=text`;
        const instagramImageUrl = `http://localhost:8500/sharing-previews/post/${id}/1080/1080`;

        const { publicPath: og_image } = await processUpload({
            url: ogImageUrl,
            key: 'social_images/' + id + '_1200_630_text.jpeg',
        });
        const { publicPath: insta_image } = await processUpload({
            url: instagramImageUrl,
            key: 'social_images/' + id + '_1080_1080.jpeg',
        });

        entry.og_image = og_image;
        entry.insta_image = insta_image;
        entry.twitter_image = og_image;

        const updateQuery = `
            UPDATE post SET 
                og_image = "${entry.og_image}",
                insta_image = "${entry.insta_image}",
                twitter_image = "${entry.twitter_image}"
            WHERE id = ${entry.id};
        `;
        const db = await getDB();
        await db.run(updateQuery);
    }

    return {
        title: entry.title,
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
        content: `
            <p>
            ${entry.excerpt}
            </p>
            ${getTOC(entries, entry.toc_header)}
            ${entry.content}
            ${entries
                .map((entry, idx) =>
                    getEntryHtmlMarkup({
                        num: idx + 1,
                        display_columns_labels,
                        display_columns,
                        entry,
                    })
                )
                .join('')}
        `,
    };
};

generatePosts();
