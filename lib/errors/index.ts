export const INPUT_DIR_NOT_FOUND = new Error('Input directory is not found');
export const THEME_DIR_NOT_FOUND = new Error('The theme directory was not found or is not a directory');
export const THEME_DIR_DOES_NOT_CONTAIN_THEME_SUBDIRECTORY = new Error('The directory has no `theme` subdirectory');
export const CONFIG_FILE_NOT_FOUND = new Error('The config file config.yml should exist in the input directory');
export const THEME_CONFIG_FILE_NOT_FOUND = new Error('The config file theme.yml should exist in the input directory under the theme directory');
export const LANGUAGES_NOT_FOUND = new Error('You need to set at least one lang in the config.langs section of your config.yaml file');
export const MENU_ITEMS_NOT_FOUND = new Error('You need to define at least one menu item with default at true in the config.menu section of your config.yml file');
export const MARKDOWN_NOT_FOUND = (s: string) => new Error(`Path ${s} to markdown files was not found`); // tslint:disable-line
export const HTML_TEMPLATE_PATH_NOT_FOUND = (s: string) => new Error(`The HTML template path ${s} was not found`); // tslint:disable-line
export const DEFAULT_LANG_NOT_FOUND = new Error('You need to provide a default language and it needs to exist'); // tslint:disable-line
export const DEFAULT_MENU_ITEM_NOT_FOUND = new Error('You need to provide a default page using defaultPage in the config section'); // tslint:disable-line
export const THEME_UNSUPPORTED_LANGUAGES = new Error('The theme does not support all the languages listed in your configuration. Please check the supported languages and update your list');
