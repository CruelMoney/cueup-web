/* eslint-disable camelcase */
const os = require('os');
const fs = require('fs').promises;
const parse = require('csv-parse/lib/sync');
const { getDB } = require('./blogDatabase');

(async function () {
    // Read the content
    const content = await fs.readFile('./scripts/songs.csv');
    // Parse the CSV content
    const records = parse(content, {
        skip_lines_with_empty_values: true,
        skipEmptyLines: true,
        skipLinesWithEmptyValues: true,
    });
    const db = await getDB();

    // insert in database
    let id = 1;
    for (const row of records) {
        const [title, artist, genres, tags, youtube_link] = row;
        await db.run(
            'insert into songs(id, title, artist, genres, tags, youtube_link) values (?, ?, ?, ?, ?, ?)',
            [id++, title, artist, genres, tags, youtube_link]
        );
    }
})();
