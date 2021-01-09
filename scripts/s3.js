require('dotenv').config();
const stream = require('stream');
const aws = require('aws-sdk');

const request = require('request');

const spacesEndpoint = new aws.Endpoint(process.env.AWS_ENDPOINT);
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
});

const s3upload = ({ key, mimetype }) => {
    const pass = new stream.PassThrough();

    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: pass,
        ACL: 'public-read',
        ContentType: mimetype,
    };

    try {
        return {
            promise: s3.upload(uploadParams).promise(),
            path: `${process.env.AWS_CLOUDFRONT_DOMAIN}/${key}`,
            writeStream: pass,
        };
    } catch (error) {
        console.log(error);
        throw new Error('Upload failed');
    }
};

const createUploadFromUrl = async ({ url }) => {
    return new Promise((resolve, eject) => {
        const createReadStream = () => request.get(url);
        const filename = url.split('/').pop();
        request.get(url).on('response', (response) => {
            const mimetype = response.headers['content-type'];

            resolve({
                filename,
                createReadStream,
                mimetype,
            });
        });
    });
};

const processUpload = async ({ url, key }) => {
    const { createReadStream, mimetype } = await createUploadFromUrl({ url });

    const fileStream = createReadStream();

    const { path, writeStream, promise } = s3upload({
        key,
        mimetype,
    });

    console.log('start uploading');
    fileStream.pipe(writeStream);
    await promise;
    console.log('upload finished: ' + path);

    return {
        publicPath: path,
        createReadStream,
        mimetype,
    };
};

module.exports = {
    processUpload,
};
