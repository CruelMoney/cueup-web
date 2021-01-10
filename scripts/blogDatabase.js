/* eslint-disable security/detect-non-literal-regexp */

/* eslint-disable camelcase */

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const SQL = require('sql-template-strings');

let db = null;

const getDB = async () => {
    if (db) {
        return db;
    }
    db = await open({
        filename: './blog.sqlite',
        driver: sqlite3.Database,
    });
    return db;
};

const closeDb = async () => {
    await db.close();
};

const getBlogPost = async (id) => {
    db = await getDB();

    const post = await db.get(
        SQL`
                    SELECT *
                    FROM post 
                    WHERE id = ${id}
                `
    );
    return post;
};

const getAllPosts = async () => {
    db = await getDB();

    const posts = await db.all(
        SQL`
            SELECT *
            FROM post 
        `
    );

    return posts;
};

const searchPosts = async ({ data_table, filter_column, filter_search }) => {
    const search = `SELECT * FROM ${data_table} WHERE ${filter_column} LIKE '%${filter_search}%'`;
    const entries = await db.all(search);
    return entries;
};

module.exports = {
    searchPosts,
    getAllPosts,
    getBlogPost,
    closeDb,
    getDB,
};
