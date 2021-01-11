/* eslint-disable camelcase */
const { getentrySlug, shuffle } = require('../blogUtils');

const getEntryHtmlMarkup = ({ num, display_columns_labels, display_columns, entry }) => {
    const { title, artist, youtube_link } = entry;

    const slug = getentrySlug({ num, title });

    const columns = JSON.parse(display_columns);
    const columnLabels = JSON.parse(display_columns_labels);

    const youTubeId = youtube_link && youtube_link.split('?v=').pop();

    return `
        <li id="${slug}">
            <p>
                <a href="${
                    youtube_link ||
                    'https://www.youtube.com/results?search_query=' +
                        encodeURIComponent(title + ' ' + artist)
                }" target="_blank" rel="noopener noreferrer">
                    ${title} - <span style="font-weight: 500;">${artist}</span>
                </a>
            </p>
        </li>
    `;
};

const templateRender = (post, entries) => {
    return `
            <p>
            ${post.excerpt}
            </p>
            ${post.content}
            <ul>
            ${shuffle(entries)
                .map((entry, idx) =>
                    getEntryHtmlMarkup({
                        num: idx + 1,
                        display_columns_labels: post.display_columns_labels,
                        display_columns: post.display_columns,
                        entry,
                    })
                )
                .join('')}
            </ul>
        `;
};

module.exports = templateRender;
