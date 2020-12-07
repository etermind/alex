import Inquirer from 'inquirer' ;
import YAML from 'yaml';
import FS from 'fs';
import FSExtra from 'fs-extra';
import Path from 'path';
import * as E from '../errors';

/**
 * Init project
 */
export default async function init(themePath: string, outputPath: string) {
    if (!FS.existsSync(themePath) || !FS.statSync(themePath).isDirectory()) {
        throw E.THEME_DIR_NOT_FOUND;
    }

    const hasThemeSubdirectory = FS.readdirSync(themePath).indexOf('theme') !== -1;

    if (!hasThemeSubdirectory) {
        throw E.THEME_DIR_DOES_NOT_CONTAIN_THEME_SUBDIRECTORY;
    }

    const themeConfigFile = Path.join(themePath, 'theme', 'theme.yml');

    if (!FS.existsSync(themeConfigFile)) {
        throw E.THEME_CONFIG_FILE_NOT_FOUND;
    }

    const themeConfig = YAML.parse(FS.readFileSync(themeConfigFile, 'utf8'));
    const { supportedLanguages = [] } = themeConfig;

    const questions = [
        {
            type: 'checkbox',
            name: 'langs',
            message: 'Select the languages',
            choices: supportedLanguages.map((s: string) => ({ name: s })),
            validate: (value: any[]) => value.length > 0,
        },
        {
            type: 'list',
            name: 'defaultLang',
            message: 'What is the default language',
            choices: supportedLanguages.map((s: string) => ({ name: s })),
            when: (answers: any) => answers.langs.length > 1,
        },
        {
            type: 'confirm',
            name: 'bootstrapConfig',
            message: 'Bootstrap a config.yml?',
            default: true,
        }
    ];

    console.log('We are going to guide you to setup your Alex! website');
    Inquirer.prompt(questions).then((answers: any) => {
        const { langs = [], defaultLang, bootstrapConfig = true } = answers;

        if (!FS.existsSync(outputPath)) {
            FS.mkdirSync(outputPath, { recursive: true });
        }

        try {
            FSExtra.copySync(themePath, outputPath);
        } catch (err) {
            console.error('Unable to copy theme... Abort!');
            return;
        }

        if (bootstrapConfig) {
            const configFile = Path.join(outputPath, 'config.yml');
            FS.renameSync(Path.join(outputPath, 'config.default.yml'), configFile);
            const config = YAML.parse(FS.readFileSync(configFile, 'utf8'));
            config.config = { langs, defaultLang:  defaultLang || langs[0] };
            FS.writeFileSync(configFile, YAML.stringify(config));
        } else {
            FS.unlinkSync(Path.join(outputPath, 'config.default.yml'));
        }

        FS.mkdirSync(Path.join(outputPath, 'data', 'files'), { recursive: true });
        FS.mkdirSync(Path.join(outputPath, 'data', 'imgs'), { recursive: true });

        for (const l of langs) {
            FS.mkdirSync(Path.join(outputPath, 'content', l), { recursive: true });
        }
    });
}
