import path from 'path';
import { compileTemplate } from './helpers';
import compilePreview from './helpers/compile-preview';

let testMode = false;

export const setTestMode = (val) => {
    testMode = val;
};

/**
 * Renders the given HTML as an image via Puppeteer.
 */
export default async ({
    jpegQuality = 100,
    output,
    size,
    template = 'basic',
    templateParams = {},
    templateBody,
    templateStyles = '',
    customTemplates = {},
    browser: userBrowser,
    preview = false,
    compileArgs = {},
    puppeteerArgs = {},
}) => {
    // Resolve preferences
    const customTemplate = customTemplates[template];
    const ext = path.extname(output).slice(1).toLowerCase();
    const type = ext === 'jpg' || ext === 'jpeg' ? 'jpeg' : 'png';

    let browser = userBrowser;

    if (!userBrowser) {
        let puppeteer;

        try {
            puppeteer = require('puppeteer');
        } catch (err) {
            throw new Error(
                'Puppeteer was not installed. Either install puppeteer@^2.0.0 as a peer dependency, or provide the `browser` arg'
            );
        }

        browser = await puppeteer.launch({
            headless: true,
            ...puppeteerArgs,
        });
    }

    const page = await browser.newPage();
    await page.setViewport(size);
    // Using template builders instead of handlebars templates allows
    // us to hide size, body and styles from the user template

    const customBody = (customTemplate && customTemplate.body) || templateBody;
    const customStyles = (customTemplate && customTemplate.styles) || templateStyles;

    const { html, body, styles } = compileTemplate({
        body: customBody,
        styles: customStyles,
        templateParams,
        size,
        compileArgs: { testMode, ...compileArgs },
    });

    let screenshot;

    if (!preview) {
        // Wait for fonts to load (via networkidle)
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Get root of page
        const pageFrame = page.mainFrame();
        const rootHandle = await pageFrame.$('body');

        // Take screenshot
        screenshot = await rootHandle.screenshot({
            path: output,
            omitBackground: true,
            type,
            quality: type === 'jpeg' ? jpegQuality : undefined,
        });
    } else {
        await page.setViewport({
            // Just needs to be larger than preview, so we can deal with any environmental rendering nuances and crop cleanly
            width: 1250,
            height: 1250,
        });

        const previewHtml = compilePreview({ body, styles, compileArgs });
        await page.setContent(previewHtml, { waitUntil: 'networkidle0' });

        // Get root of page
        const pageFrame = page.mainFrame();
        const rootHandle = await pageFrame.$('body > *');

        // Take screenshot
        screenshot = await rootHandle.screenshot({
            path: output,
            omitBackground: true,
            type,
            quality: type === 'jpeg' ? jpegQuality : undefined,
        });
    }

    if (!userBrowser) {
        browser.close();
    } else {
        page.close();
    }

    return screenshot;
};
