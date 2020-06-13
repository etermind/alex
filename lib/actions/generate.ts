import _ from 'lodash';
import YAML from 'yaml';
import YAMLMetadataParser from 'markdown-yaml-metadata-parser';
import Showdown from 'showdown';
import Path from 'path';
import Nunjucks from 'nunjucks';
import Rimraf from 'rimraf';
import FS from 'fs';
import FSExtra from 'fs-extra';
import * as E from '../errors';

const Converter = new Showdown.Converter(); // tslint:disable-line
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
 * Generate a page
 */
async function generatePage(
    lang: string,
    menuItem: string,
    globalConfig: any,
    input: string,
    output: string
) {
    const menuConfig: any = globalConfig.menu[menuItem] || {};
    const config: any = globalConfig.config || {};

    if (Object.keys(menuConfig).length === 0) {
        console.warn(`Menu item ${menuItem} is empty, nothing is going to be generated`);
        return;
    }

    if (menuConfig.external) {
        return;
    }

    const markdownPath = Path.join(input, 'content', lang, menuItem);

    if (!FS.existsSync(markdownPath)) {
        throw E.MARKDOWN_NOT_FOUND(markdownPath);
    }

    const contentInfo = await extractMarkdown(markdownPath);

    const obj: any = {
        lang,
        menu: Object.entries(globalConfig.menu),
        content: contentInfo,
        title: globalConfig.title[lang] || '',
        keywords: (config.keywords || []).join(', '),
        meta: _.merge(
            {},
            config.meta,
            { keywords: config.meta.keywords.join(', ') },
            { description: config.meta.description[lang] }
        ),
    };

    const htmlTplPath = Path.join(input, 'theme', 'html');
    if (!FS.existsSync(htmlTplPath)) {
        throw E.HTML_TEMPLATE_PATH_NOT_FOUND(htmlTplPath);
    }

    const finalHtml = await renderTemplate(
        htmlTplPath,
        `${lang}/${contentInfo.metadata.template || 'index.htm'}`,
        obj);
    const outputFile = Path.join(output, lang, `${menuItem}.htm`);
    FSExtra.writeFileSync(outputFile, finalHtml);
}

/**
 * Generate the pages
 */
async function generatePages(lang: string, globalConfig: any, input: string, output: string) {
    const pathWithLang = Path.join(output, lang);
    FS.mkdirSync(pathWithLang);

    const menuItems = Object.keys(globalConfig.menu || {});

    if (menuItems.length === 0) {
        throw E.MENU_ITEMS_NOT_FOUND;
    }

    for (const item of menuItems) {
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

    const path = Path.join(output, defaultLang, `${defaultPage}.htm`);
    const destPath = Path.join(output, 'index.htm');
    FSExtra.copySync(path, destPath);
}

/**
 * Copy files
 * @param globalConfig The parsed YAML config
 * @param input The input directory
 * @param output The output directory
 */
async function copyFiles(globalConfig: any, input: string, output: string) {
    await copyIndexFile(globalConfig, output);

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
 * Generate the static site
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
    await copyFiles(globalConfig, input, output);
}
