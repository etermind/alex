import _ from 'lodash';
import YAML from 'yaml';
import YAMLMetadataParser from 'markdown-yaml-metadata-parser';
import Showdown from 'showdown';
import ShowdownHighlight from 'showdown-highlight';
import ShowdownKatex from 'showdown-katex';
import Path from 'path';
import Nunjucks from 'nunjucks';
import Rimraf from 'rimraf';
import FS from 'fs';
import FSExtra from 'fs-extra';
import * as E from '../errors';

const Converter = new Showdown.Converter({ // tslint:disable-line
    extensions: [ShowdownHighlight, ShowdownKatex({ displayMode: false })],
});
Converter.setFlavor('github');

/**
 * Render template
 * @param path The path to the templates and partials
 * @param template The template
 * @param info The object to be injected into the template
 * @return The rendered template (or an empty string)
 */
async function renderTemplate(path: string, template: string, info: any): Promise<string> {
    Nunjucks.configure(path, { autoescape: true });
    return Nunjucks.render(template, info) || '';
}

/**
 * Extract markdown
 * @param input The input path
 * @return An object with the metadata and all the markdown content
 */
async function extractMarkdown(input: string): Promise<any> {
    const list = FS.readdirSync(input);

    return list.reduce((obj: any, f: string) => {
        if (!f.endsWith('.md')) {
            return obj;
        }

        const name = f.replace('\.md', '');
        const markdownFile = Path.join(input, f);

        const markdownContent = FS.readFileSync(markdownFile, 'utf8');
        const { metadata, content } = YAMLMetadataParser(markdownContent);
        const insideContent = Converter.makeHtml(content);

        obj.metadata = _.merge({}, obj.metadata, metadata);
        obj[name] = insideContent;

        return obj;
    }, {});
}

/**
 * Generate page and recursively generates pages for submenus
 * @param menuItem The current menu item (with potential submenus
 * @param rootPath The current directory
 * @param lang The current language
 * @param globalConfig The config
 * @param input The input path
 * @param output The output path
 */
async function generatePageRecursively(
    menuItem: any,
    rootPath: string,
    lang: string,
    globalConfig: any,
    input: string,
    output: string
) {
    const config: any = globalConfig.config || {};
    const lastPartOfPath = Path.parse(rootPath).base;

    if (FS.existsSync(rootPath)) {
        const contentInfo = await extractMarkdown(rootPath);

        const obj: any = {
            lang,
            languages: config.langs,
            menu: globalConfig.menu,
            content: contentInfo,
            title: globalConfig.title[lang] || '',
            subpages: menuItem.submenus || [],
            meta: _.merge(
                {},
                config.meta,
                { keywords: config.meta.keywords.join(', ') },
                { description: config.meta.description[lang] }
            ),
            scripts: config.scripts || [],
            theme: globalConfig.theme || {},
        };

        const htmlTplPath = Path.join(input, 'theme', 'html');
        if (!FS.existsSync(htmlTplPath)) {
            throw E.HTML_TEMPLATE_PATH_NOT_FOUND(htmlTplPath);
        }

        const outputPath = Path.join(output, lastPartOfPath);
        if (!FS.existsSync(outputPath)) {
            FS.mkdirSync(outputPath);
        }

        // Generate only if a md file has been found under the path
        if (contentInfo.metadata) {
            const finalHtml = await renderTemplate(
                htmlTplPath,
                `${lang}/${contentInfo.metadata.template || 'index.htm'}`,
                obj);

            const outputFile = Path.join(outputPath, 'index.htm');

            FSExtra.writeFileSync(outputFile, finalHtml);
        }

    }

    for (const submenu of (menuItem.submenus || [])) {
        const newPath = Path.join(rootPath, submenu.content);
        const newOutput = Path.join(output, lastPartOfPath);
        await generatePageRecursively(submenu, newPath, lang, globalConfig, input, newOutput);
    }
}

/**
 * Generate a page
 *
 * - Check the menu item
 * - Exit if the item has external set to true
 * - Check the markdown path and extract the content
 * - Check if the template exists and render the HTML
 * - Write the final HTML page in the output directory
 *
 * @param lang The current language
 * @param menuItem The current menu item
 * @param globalConfig The config
 * @param input The input path
 * @param output The output path
 */
async function generatePage(
    lang: string,
    menuItem: any,
    globalConfig: any,
    input: string,
    output: string
) {
    if (Object.keys(menuItem).length === 0) {
        console.warn('Menu is empty, nothing is going to be generated');
        return;
    }

    if (menuItem.external) {
        return;
    }

    const markdownPath = Path.join(input, 'content', lang, menuItem.content);

    await generatePageRecursively(
        menuItem,
        markdownPath,
        lang,
        globalConfig,
        input,
        Path.join(output, lang)
    );
}

/**
 * Generate the pages
 * - Create the directory for the current lang
 * - Get the menu items
 * - Generate one page per item
 *
 * @param lang The current lang
 * @param globalConfig The config
 * @param input The input path
 * @param output The output path
 */
async function generatePages(lang: string, globalConfig: any, input: string, output: string) {
    const pathWithLang = Path.join(output, lang);
    FS.mkdirSync(pathWithLang);

    if ((globalConfig.menu || []).length === 0) {
        throw E.MENU_ITEMS_NOT_FOUND;
    }

    for (const item of globalConfig.menu) {
        await generatePage(lang, item, globalConfig, input, output);
    }
}

/**
 * Copy index file with default language
 * @param globalConfig The parsed YAML config
 * @param output The output directory
 */
async function copyIndexFile(globalConfig: any, output: string) {
    const { config = {} } = globalConfig;
    const { defaultLang, langs = [], defaultPage } = config;

    if (!defaultLang || langs.find((l :string) => l === defaultLang) === undefined) {
        throw E.DEFAULT_LANG_NOT_FOUND;
    }

    if (!defaultPage) {
        throw E.DEFAULT_MENU_ITEM_NOT_FOUND;
    }

    const path = Path.join(output, defaultLang, defaultPage, 'index.htm');
    const destPath = Path.join(output, 'index.htm');
    FSExtra.copySync(path, destPath);

    // Copy default page for each language
    for (const l of langs) {
        const perLangPath = Path.join(output, l, defaultPage, 'index.htm');
        const destPerLangPath = Path.join(output, l, 'index.htm');
        FSExtra.copySync(perLangPath, destPerLangPath);
    }

}

/**
 * Copy static files: user files and theme files
 *
 * @param input The input directory
 * @param output The output directory
 */
async function copyFiles(input: string, output: string) {
    ['css', 'fonts', 'imgs', 'js'].forEach((d: string) => {
        try {
            FSExtra.copySync(Path.join(input, 'theme', d), Path.join(output, 'assets', d));
        } catch (err) {

        }
    });

    ['imgs', 'files'].forEach((d: string) => {
        try {
            FSExtra.copySync(Path.join(input, 'data', d), Path.join(output, 'assets', 'user', d));
        } catch (err) {

        }
    });
}

/**
 * Generate the static site.
 * - Check the input and output directory
 * - Read the YAML config
 * - Iterate over the languages list and generate the pages
 *
 * @param input The input directory
 * @param output The output directory
 */
export default async function generate(input: string, output: string) {
    if (!FS.existsSync(input)) {
        throw E.INPUT_DIR_NOT_FOUND;
    }

    if (!FS.existsSync(output)) {
        FS.mkdirSync(output);
    } else {
        Rimraf.sync(output);
        FS.mkdirSync(output);
    }

    const configFile = Path.join(input, 'config.yaml');

    if (!FS.existsSync(configFile)) {
        throw E.CONFIG_FILE_NOT_FOUND;
    }

    const globalConfig = YAML.parse(FS.readFileSync(configFile, 'utf8'));

    const { config = {} } = globalConfig;

    const langs: string[] = (config.langs || []);
    if (langs.length === 0) {
        throw E.LANGUAGES_NOT_FOUND;
    }

    for (const lang of langs) {
        await generatePages(lang, globalConfig, input, output);
    }
    await copyIndexFile(globalConfig, output);
    await copyFiles(input, output);
}
