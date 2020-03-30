const fs = require('fs');

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
    const data = fs.readFileSync('./content.json');

    const newData = parseFile(JSON.parse(data));

    fs.writeFileSync('./newContent.json', JSON.stringify(newData));
};

main();
