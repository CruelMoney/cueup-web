/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable camelcase */
const fs = require('fs');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const SQL = require('sql-template-strings');
const slugify = require('slugify');

let db = null;

const getDB = async () => {
    return await open({
        filename: './blog.sqlite',
        driver: sqlite3.Database,
    });
};

const generatePosts = async () => {
    db = await getDB();

    const posts = await db.all(
        SQL`
                    SELECT *
                    FROM post 
                `
    );
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

    await db.close();
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
        data_table,
        filter_column,
        display_columns_labels,
        display_columns,
        filter_search,
    } = entry;
    // get rows from db
    const search = `SELECT * FROM ${data_table}  WHERE ${filter_column} LIKE '%${filter_search}%'`;
    const entries = await db.all(search);

    return {
        title: entry.title,
        slug: entry.slug,
        excerpt: entry.excerpt,
        published_date: entry.created_at,
        updated_date: entry.updated_at,
        author: entry.author,
        thumbnail_url: entry.image,
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
