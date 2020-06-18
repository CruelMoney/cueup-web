const fs = require('fs');
const path = require('path');

const parseObject = (entry, en, da) => {
    Object.entries(entry).forEach(([key, val]) => {
        console.log(key, val);
        // terminate
        if (Array.isArray(val)) {
            en[key] = val[0];
            da[key] = val[1];
            return;
        }

        da[key] = {};
        en[key] = {};

        parseObject(val, en[key], da[key]);
    });
};

const parseFile = (content) => {
    // initialze
    const newContent = {
        en: {},
        da: {},
    };

    parseObject(content, newContent.en, newContent.da);

    return newContent;
};

const main = () => {
    const files = findFilesInDir('./src', '/content/common.json');

    for (const file of files) {
        const data = fs.readFileSync(file);

        const newData = parseFile(JSON.parse(data));

        fs.writeFileSync(file, JSON.stringify(newData));
    }
};

/**
 * Find all files recursively in specific folder with specific extension, e.g:
 * findFilesInDir('./project/src', '.html') ==> ['./project/src/a.html','./project/src/build/index.html']
 * @param  {String} startPath    Path relative to this file or other file which requires this files
 * @param  {String} filter       Extension name, e.g: '.html'
 * @return {Array}               Result files with path string in an array
 */
function findFilesInDir(startPath, filter) {
    let results = [];

    if (!fs.existsSync(startPath)) {
        console.log('no dir ', startPath);
        return;
    }

    const files = fs.readdirSync(startPath);
    for (const element of files) {
        const filename = path.join(startPath, element);
        const stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            results = results.concat(findFilesInDir(filename, filter)); //recurse
        } else if (filename.includes(filter)) {
            console.log('-- found: ', filename);
            results.push(filename);
        }
    }
    return results;
}

main();
