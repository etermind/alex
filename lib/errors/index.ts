export const INPUT_DIR_NOT_FOUND = new Error('Input directory is not found');
export const CONFIG_FILE_NOT_FOUND = new Error('The config file config.yaml should exist in the input directory');
export const LANGUAGES_NOT_FOUND = new Error('You need to set at least one lang in the config.langs section of your config.yaml file');
export const MENU_ITEMS_NOT_FOUND = new Error('You need to define at least one menu item with default at true in the config.menu section of your config.yaml file');
export const MARKDOWN_NOT_FOUND = (s: string) => new Error(`Path ${s} to markdown files was not found`); // tslint:disable-line
export const HTML_TEMPLATE_PATH_NOT_FOUND = (s: string) => new Error(`The HTML template path ${s} was not found`); // tslint:disable-line
export const DEFAULT_LANG_NOT_FOUND = new Error('You need to provide a default language and it needs to exist'); // tslint:disable-line
export const DEFAULT_MENU_ITEM_NOT_FOUND = new Error('You need to provide a default menu item using default:true in menu section'); // tslint:disable-line
