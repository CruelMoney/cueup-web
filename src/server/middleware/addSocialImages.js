import express from 'express';
import { middleware as sanitize } from 'sanitize';
import { getBlogPost } from 'routes/Blog/generateDJSoftwarePosts';
import renderSocialImage from '../socialImage/src';
import defaultImage from '../../shared/assets/images/default.png';

const router = express.Router();
const { readFileSync } = require('fs');

const sizeMap = {
    facebook: { width: 1200, height: 630 },
    twitter: { width: 1200, height: 630 },
};

const djNameGenerator = async (req, res) => {
    try {
        let name = req.path.split('/').pop();

        if (!name) {
            throw new Error('name not included');
        }

        name = decodeURIComponent(name);

        const puppeteerArgs = {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        };

        if (process.env.NODE_ENV !== 'development') {
            puppeteerArgs.executablePath = '/usr/bin/chromium-browser';
        }

        const img = await renderSocialImage({
            puppeteerArgs,
            templateBody: `
            <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@900&display=swap" rel="stylesheet"> 
                <div class="main">
                    <div class="content">
                        <svg xmlns="http://www.w3.org/2000/svg" class="logo" width="97px" height="45px" viewBox="0 0 202.98 86.44"><title>Logo</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path d="M17.39,86.44C11,86.44,6.22,84.5,3.25,80.69-.2,76.26-.92,69.54,1.17,61.27L10.41,24.2C14.23,9,24.55,0,38,0c6.78,0,11.4,1.7,14.12,5.19,3.7,4.74,3.82,12.2.42,25.74l-.38,1.51h-13L39.81,30c1.6-6.34,3-12.76.84-15.51-.88-1.13-2.44-1.68-4.78-1.68-8.58,0-11.74,8.68-12.71,12.42L13.93,62.24c-1,4.32-.8,7.76.69,9.65,1,1.28,2.62,1.91,4.93,1.91,7.85,0,11.13-7,13.89-18.28L33.82,54h13l-.61,2.48C42.64,71,37.18,86.44,17.39,86.44Z"></path><path d="M44.27,56c-3.72,15.12-8.88,28.44-26.88,28.44C3.47,84.44-.13,74.6,3.11,61.76l9.24-37.08C15.59,11.84,24.11,2,38,2c16.08,0,17.28,9.84,12.6,28.44H41.75c2.52-10,4.44-19.68-5.88-19.68-7.92,0-12.72,6.48-14.64,13.92L12,61.76c-1.8,7.44-.36,14,7.56,14C29,75.8,32.63,67.28,35.39,56Z"></path><path d="M62.14,86.26c-6.31,0-9.58-2.48-11.21-4.56-2.59-3.31-3.19-8.16-1.74-14L60.94,20.29H71.8l-12,47.9c-.66,2.74-.51,4.93.44,6.13a4.28,4.28,0,0,0,3.54,1.3c6.27,0,8.37-5.87,9-8.39L84.51,20.29H95.37L83.28,68.64C80.55,79.67,72.65,86.26,62.14,86.26Z"></path><path d="M81.34,68.16c-2.36,9.55-9.19,16.1-19.2,16.1s-13.38-6.55-11-16.1L62.51,22.29h6.73L57.86,67.7c-1.36,5.64.19,9.92,5.92,9.92s9.55-4.28,10.92-9.92L86.08,22.29h6.73Z"></path><polygon points="85.24 85.72 101.43 20.38 130.13 20.38 127.49 30.93 109.47 30.93 105.2 47.86 117.2 47.86 114.57 58.51 102.56 58.51 98.45 75.07 116.47 75.07 113.84 85.72 85.24 85.72"></polygon><path d="M114.64,49.86,113,56.51H101L95.9,77.07h18l-1.64,6.65H87.8L103,22.38h24.58l-1.64,6.55h-18l-5.28,20.93Z"></path><path d="M136.75,86.26c-6.31,0-9.58-2.48-11.21-4.56-2.59-3.31-3.19-8.16-1.74-14l11.75-47.38h10.86l-12,47.9c-.66,2.74-.51,4.93.44,6.13a4.27,4.27,0,0,0,3.54,1.3c6.27,0,8.36-5.87,9-8.39l11.76-46.94H170L157.89,68.64C155.16,79.67,147.26,86.26,136.75,86.26Z"></path><path d="M156,68.16c-2.36,9.55-9.19,16.1-19.2,16.1s-13.38-6.55-11-16.1l11.37-45.87h6.74L132.47,67.7c-1.36,5.64.18,9.92,5.92,9.92s9.55-4.28,10.92-9.92l11.37-45.41h6.74Z"></path><path d="M158.85,85.72l16.28-65.34H189c5.34,0,9.24,1.53,11.58,4.54,2.63,3.37,3.12,8.38,1.46,14.88-4.15,16.59-14.4,18.64-25.67,18.79l-6.74,27.13Zm21.94-37.86c5.92,0,9.13-2.7,10.71-9a11.06,11.06,0,0,0,.35-5c-.2-.76-.69-2.64-5.47-2.64h-3.16l-4.15,16.66Z"></path><path d="M176.7,22.38H189c11,0,13.65,6.92,11.1,16.93-3.91,15.65-13,17.29-25.3,17.29l-6.73,27.12h-6.64ZM187,26.57c8.64,0,11,4.46,8.92,12.74-2.1,8.55-6.92,13.1-15.75,13.1h-6.91l6.46-25.84Zm-6.19,23.29c7.1,0,10.92-3.64,12.65-10.55,1.64-6.65-.18-10.29-7.1-10.29h-4.73l-5.19,20.84Zm0,.18c7.1,0,10.92-3.64,12.65-10.56,1.64-6.64-.18-10.28-7.1-10.28h-4.73L176.46,50Z"></path></g></g></svg>
                        <p>I found my DJ name:</p>
                        <h1 class="dj-name">
                            {{name}}
                        </h1>
                        <div class="button">
                            <span>What is your DJ name?</span>
                            <svg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'><title>ionicons-v5-a</title><path d='M464,256c0-114.87-93.13-208-208-208S48,141.13,48,256s93.13,208,208,208S464,370.87,464,256ZM251.35,347.36a16,16,0,0,1-.09-22.63L303.58,272H170a16,16,0,0,1,0-32H303.58l-52.32-52.73A16,16,0,1,1,274,164.73l79.39,80a16,16,0,0,1,0,22.54l-79.39,80A16,16,0,0,1,251.35,347.36Z'/></svg>
                        </div>
                    </div>
                </div>
            <div class="gradient" />

            `,
            templateStyles: `
                @font-face {
                    font-family: "HangTheDj";
                    font-style: normal;
                    src: url(data:font/truetype;charset=utf-8;base64,${readFileSync(
                        './public/fonts/HANGTHEDJ.ttf'
                    ).toString('base64')}) format('truetype');
                }

                body{
                    font-size: 50px;
                    padding: 50px;
                    background-image: linear-gradient(135deg, #f77062 0%, #fe5196 100%);
                    font-weight: 900;
                }
                .dj-name{
                    font-family: "HangTheDJ";
                    font-size: 2em;
                    line-height: 1.2em;
                    letter-spacing: 5px;
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                }
    
                .button{
                    font-size: 0.75em;
                    position: absolute;
                    bottom: 0em;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }
                
                ${templateStyles}
            `,
            templateParams: {
                name,
            },
            output: 'image.png',
            size: sizeMap.facebook,
        });

        res.set('Cache-Control', 'public, max-age=31557600, s-maxage=31557600'); // 1 year
        res.contentType('image/png');
        res.send(img);
    } catch (error) {
        // fallback image
        console.log(error);
        res.redirect('/images/dj-name-generator.png');
    }
};

const getPostImage = async (req, res) => {
    try {
        const { id, height, width } = req.params;
        const { template } = req.query;

        const post = await getBlogPost(id);

        if (!post) {
            throw new Error('Post not found');
        }

        const puppeteerArgs = {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        };

        if (process.env.NODE_ENV !== 'development') {
            puppeteerArgs.executablePath = '/usr/bin/chromium-browser';
        }

        const templates = {
            text: `<link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@900&display=swap" rel="stylesheet"> 
                    <div class="main">
                        <div class="content">
                            <div style="flex: 1;"></div>
                            <h2 style="margin-bottom: 40px">
                            ${post.title}
                            </h2>
                            <div class="row">
                                <img class="avatar" src="${post.author_image}"></img>
                                <p style="margin-right: 100px;">${post.author}</p>
                                <div style="flex: 1;"></div>
                            <svg xmlns="http://www.w3.org/2000/svg" class="logo" width="97px" height="45px" viewBox="0 0 202.98 86.44"><title>Logo</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path d="M17.39,86.44C11,86.44,6.22,84.5,3.25,80.69-.2,76.26-.92,69.54,1.17,61.27L10.41,24.2C14.23,9,24.55,0,38,0c6.78,0,11.4,1.7,14.12,5.19,3.7,4.74,3.82,12.2.42,25.74l-.38,1.51h-13L39.81,30c1.6-6.34,3-12.76.84-15.51-.88-1.13-2.44-1.68-4.78-1.68-8.58,0-11.74,8.68-12.71,12.42L13.93,62.24c-1,4.32-.8,7.76.69,9.65,1,1.28,2.62,1.91,4.93,1.91,7.85,0,11.13-7,13.89-18.28L33.82,54h13l-.61,2.48C42.64,71,37.18,86.44,17.39,86.44Z"></path><path d="M44.27,56c-3.72,15.12-8.88,28.44-26.88,28.44C3.47,84.44-.13,74.6,3.11,61.76l9.24-37.08C15.59,11.84,24.11,2,38,2c16.08,0,17.28,9.84,12.6,28.44H41.75c2.52-10,4.44-19.68-5.88-19.68-7.92,0-12.72,6.48-14.64,13.92L12,61.76c-1.8,7.44-.36,14,7.56,14C29,75.8,32.63,67.28,35.39,56Z"></path><path d="M62.14,86.26c-6.31,0-9.58-2.48-11.21-4.56-2.59-3.31-3.19-8.16-1.74-14L60.94,20.29H71.8l-12,47.9c-.66,2.74-.51,4.93.44,6.13a4.28,4.28,0,0,0,3.54,1.3c6.27,0,8.37-5.87,9-8.39L84.51,20.29H95.37L83.28,68.64C80.55,79.67,72.65,86.26,62.14,86.26Z"></path><path d="M81.34,68.16c-2.36,9.55-9.19,16.1-19.2,16.1s-13.38-6.55-11-16.1L62.51,22.29h6.73L57.86,67.7c-1.36,5.64.19,9.92,5.92,9.92s9.55-4.28,10.92-9.92L86.08,22.29h6.73Z"></path><polygon points="85.24 85.72 101.43 20.38 130.13 20.38 127.49 30.93 109.47 30.93 105.2 47.86 117.2 47.86 114.57 58.51 102.56 58.51 98.45 75.07 116.47 75.07 113.84 85.72 85.24 85.72"></polygon><path d="M114.64,49.86,113,56.51H101L95.9,77.07h18l-1.64,6.65H87.8L103,22.38h24.58l-1.64,6.55h-18l-5.28,20.93Z"></path><path d="M136.75,86.26c-6.31,0-9.58-2.48-11.21-4.56-2.59-3.31-3.19-8.16-1.74-14l11.75-47.38h10.86l-12,47.9c-.66,2.74-.51,4.93.44,6.13a4.27,4.27,0,0,0,3.54,1.3c6.27,0,8.36-5.87,9-8.39l11.76-46.94H170L157.89,68.64C155.16,79.67,147.26,86.26,136.75,86.26Z"></path><path d="M156,68.16c-2.36,9.55-9.19,16.1-19.2,16.1s-13.38-6.55-11-16.1l11.37-45.87h6.74L132.47,67.7c-1.36,5.64.18,9.92,5.92,9.92s9.55-4.28,10.92-9.92l11.37-45.41h6.74Z"></path><path d="M158.85,85.72l16.28-65.34H189c5.34,0,9.24,1.53,11.58,4.54,2.63,3.37,3.12,8.38,1.46,14.88-4.15,16.59-14.4,18.64-25.67,18.79l-6.74,27.13Zm21.94-37.86c5.92,0,9.13-2.7,10.71-9a11.06,11.06,0,0,0,.35-5c-.2-.76-.69-2.64-5.47-2.64h-3.16l-4.15,16.66Z"></path><path d="M176.7,22.38H189c11,0,13.65,6.92,11.1,16.93-3.91,15.65-13,17.29-25.3,17.29l-6.73,27.12h-6.64ZM187,26.57c8.64,0,11,4.46,8.92,12.74-2.1,8.55-6.92,13.1-15.75,13.1h-6.91l6.46-25.84Zm-6.19,23.29c7.1,0,10.92-3.64,12.65-10.55,1.64-6.65-.18-10.29-7.1-10.29h-4.73l-5.19,20.84Zm0,.18c7.1,0,10.92-3.64,12.65-10.56,1.64-6.64-.18-10.28-7.1-10.28h-4.73L176.46,50Z"></path></g></g></svg>
                            </div>
                        </div>
                    </div>
                    <img class="bg-image" src="${post.image}" width="100%" height="100%"></img>
                    <div class="img-overlay"></div>
                `,
            image: `
                    <img class="bg-image" src="${post.image}" width="100%" height="100%"></img>
                `,
        };

        const img = await renderSocialImage({
            puppeteerArgs,
            templateBody: templates[template] || templates.image,
            templateStyles: `
                ${templateStyles}
                .logo{
                    position: relative;
                    height: 1.2em;
                    margin-bottom: 0;
                    right: 0;
                    top: initial;
                    bottom: 0;
                }
                .content {
                    display: flex;
                    flex-direction: column;
                }
            `,
            templateParams: {
                id,
                width,
                height,
            },
            output: 'image.png',
            size: { width: parseInt(width, 10), height: parseInt(height, 10) },
        });

        res.set('Cache-Control', 'public, max-age=31557600, s-maxage=31557600'); // 1 year
        res.contentType('image/png');
        res.send(img);
    } catch (error) {
        // fallback image
        console.log(error);
        res.redirect(defaultImage);
    }
};

const addSocialImages = (app) => {
    router.use(sanitize);
    router.get('/dj-name-generator/*', djNameGenerator);
    router.get('/post/:id/:height/:width', getPostImage);

    app.use('/sharing-previews', router);
};

export default addSocialImages;

const templateStyles = `        
            * {
                box-sizing: border-box;
                margin: 0;
            }

            html,
            body {
                margin         : 0;
                padding        : 0;
                height         : 100%;
                width          : 100%;
                overflow       : hidden;
                font-family    : "system", sans-serif;
                color          : #fff;
                font-family    : 'Source Sans Pro', sans-serif;
                text-rendering : optimizelegibility;
            }

            body{
                font-size: 50px;
                padding: 50px;
            }

            .main {
                overflow: hidden;
                position: relative;
                width: 100%;
                height: 100%;
            }
          
            svg, svg path{
                stroke: #fff;
                fill: #fff;
                width: auto;
            }

            .logo{
                height: 1.2em;
                margin-bottom: 0.5em;
                position: absolute;
                right: 0;
                top: 0;
            }

          
            .button span{
                position: relative;
                z-index: 2;
            }
            .button svg{
                margin-bottom: -10px;
                height: 100px;
                width: 100px;
            }
            .content{
                position: relative;
                z-index: 1;
                height: 100%;
                width: 100%;
            }

            .gradient {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 0;
                background-image: linear-gradient(0deg, #11111170 0%, transparent 50%);
            }

            p{
                font-size: 0.75em;
                margin-bottom: 1em;
            }

            .bg-image{
                position: absolute;
                height: 100%;
                width: 100%;
                object-fit: cover;
                top: 0;
                left: 0;
            }

            .img-overlay {
                position: absolute;
                height: 100%;
                width: 100%;
                top: 0;
                left: 0;
                background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
            }

                .row{
                    display: flex;
                    align-items: center;
                }
                .row p {
                    margin-bottom: 0;
                }
                
                .avatar {
                    height: 100px;
                    width: 100px;
                    border-radius: 50px;
                    border: 4px solid white;
                    object-fit: cover;
                    margin-right: 20px;
                }
            `;
