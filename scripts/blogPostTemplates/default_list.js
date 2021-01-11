/* eslint-disable camelcase */
const { isURL, getentrySlug } = require('../blogUtils');

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

const templateRender = (post, entries) => {
    return `
            <p>
            ${post.excerpt}
            </p>
            ${getTOC(entries, post.toc_header)}
            ${post.content}
            ${entries
                .map((entry, idx) =>
                    getEntryHtmlMarkup({
                        num: idx + 1,
                        display_columns_labels: post.display_columns_labels,
                        display_columns: post.display_columns,
                        entry,
                    })
                )
                .join('')}
        `;
};

module.exports = templateRender;
