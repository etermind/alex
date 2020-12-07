import Inquirer from 'inquirer' ;
import YAML from 'yaml';
import FS from 'fs';
import FSExtra from 'fs-extra';
import Path from 'path';
import * as E from '../errors';

const questions = [
    {
        type: 'confirm',
        name: 'toBeDelivered',
        message: 'Is this for delivery?',
        default: false,
    },
    {
        type: 'input',
        name: 'phone',
        message: "What's your phone number?",
        validate: (value: string) => {
            const pass = value.match(
                /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i
            );
            if (pass) {
                return true;
            }

            return 'Please enter a valid phone number';
        },
    },
    {
        type: 'list',
        name: 'size',
        message: 'What size do you need?',
        choices: ['Large', 'Medium', 'Small'],
        filter: (val: string) => {
            return val.toLowerCase();
        },
    },
    {
        type: 'input',
        name: 'quantity',
        message: 'How many do you need?',
        validate: (value: any) => {
            const valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
        },
        filter: Number,
    },
    {
        type: 'expand',
        name: 'toppings',
        message: 'What about the toppings?',
        choices: [
            {
                key: 'p',
                name: 'Pepperoni and cheese',
                value: 'PepperoniCheese',
            },
            {
                key: 'a',
                name: 'All dressed',
                value: 'alldressed',
            },
            {
                key: 'w',
                name: 'Hawaiian',
                value: 'hawaiian',
            }
        ],
    },
    {
        type: 'rawlist',
        name: 'beverage',
        message: 'You also get a free 2L beverage',
        choices: ['Pepsi', '7up', 'Coke'],
    },
    {
        type: 'input',
        name: 'comments',
        message: 'Any comments on your purchase experience?',
        default: 'Nope, all good!',
    },
    {
        type: 'list',
        name: 'prize',
        message: 'For leaving a comment, you get a freebie',
        choices: ['cake', 'fries'],
        when: (answers: any) => {
            return answers.comments !== 'Nope, all good!';
        },
    }
];

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
