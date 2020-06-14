# Alex!

[![GitHub release][release-image]][release-url]
[![MIT License][license-image]][license-url]

[release-image]:https://img.shields.io/github/release/etermind/alex.svg?style=flat-square
[release-url]:https://github.com/etermind/alex/releases/latest
[license-image]:http://img.shields.io/badge/license-MIT-000000.svg?style=flat-square
[license-url]:LICENSE.txt

Welcome to Alex! 

Alex is a minimalist static site generator written in TypeScript.

By writing markdown files and changing a YAML config, you can create a static site in the matter of minutes.

Check this [website](https://akb89.gitlab.io) for a live (and real) example.

## Why?

Because my roommate needed a minimalistic static generator way less complicated than [Hugo](https://gohugo.io) or [Hexo](https://hexo.io).

## How easy can it get?

Using standard technologies and well-known libraries, Alex is only 350 lines of code with comments!

## Is it powerful?

Alex is powerful enough! He supports: 

- Multiple languages 
- Themes 
- Code highlighting (using [highlightjs](https://highlightjs.org))
- Markdown (Github flavor) with YAML metadata
- User defined files
- Pages and subpages
- Easy configuration with YAML

But if you expect a fully-featured static site generator, you should use something else.

## Getting started

```sh
npm install @etermind/alex -g
```

You'll end up with `alex` in your PATH and then you can just do:

```sh
alex generate -i INPUT_DIR_WITH_CONTENT -o OUTPUT_DIR_WITH_GENERATED_SITE
```

You can then serve your site (for testing purpose) with:

```sh
alex serve -p OUTPUT_DIR_WITH_GENERATED_SITE -P 4444
```

which is going to serve your website on [http://localhost:4444](http://localhost:4444)

Let's try it out: 

1. Download the example skeleton [here](./skeleton.tar.gz);
2. Then unzip the skeleton (`tar xzfv skeleton.tar.gz` should do);
3. Then run `alex` with `alex generate -i skeleton -o mysite`;
4. You should end up with a folder called `mysite`;
5. Finally run `alex serve -p mysite -P 4444`, open [http://localhost:4444](http://localhost:4444) and admire your new site.

## Configuring Alex

An Alex website is composed of:

- `config.yaml` where the main config of the website lies;
- `content` where all your markdown files are;
- `data` for user generated files and images;
- `theme` for the theme and the rendering of your site;

### Understanding config.yaml

Here is a simple `config.yaml` file:

```yaml
title:
    fr: 'Mon titre'
    en: 'Your title'

config:
    langs: 
        - en
        - fr
    defaultLang: 'en'
    defaultPage: 'home'
    meta:
        description: 
            fr: 'Ma super description dans la balise meta'
            en: 'My awesome description in the meta tag'
        keywords: 
            - awesome 
            - site 
            - alex 
menu:
    home: 
        name: 
            fr: 'Accueil'
            en: 'Home'
        external: false
        hide: false 
    code:
        name:
            fr: 'Code'
            en: 'Code'
        external: true
        link: 'http://github.com/cocophotos'
        target: '_blank'
```

A `config.yaml` is composed of 3 sections:

- `title` which is the title of your website (often used in the `title` tag).
- `config` which allow you to define all supported languages for your website, the default language and the meta information
- `menu` which defines the main menu of your website.

#### Config section

The `config` section is divided into:

1. `langs`: A list of languages following the [ISO-639-1 standard](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (two letters to describe the language such as `fr` for French or `en` for English).
2. `defaultLang`: The default language of your website.
3. `defaultPage`: The default page of your website (it should match one of your menu item).
3. `meta`: The meta tags for your website.

*Meta*

`meta` is used by the theme to generate the meta tags. 

- Keywords is a list that is transformed into a comma separated string.
- Description supports multiple languages.

*Langs*

You can activate or deactivate a language by adding or removing a language here. Be aware that the theme you are using should support your default language, because if one of your other languages is not supported, we fallback to the default one.

#### Menu section

You can as many menu items as you want.

In our example, `home` is going to be the first menu item and `code` the last one.

Each menu item is composed of:

1. A name, which supports multiple languages
2. A boolean called `external` to know if the item should redirect to an external page or not.
3. A boolean called `hide` to know if the item should be hidden in the menu.
4. If the item is external, you can specify a `link` and an optional `target`.

### Managing content
All the content of your website lies in the `content` directory.

The content of the directory should look like this:

```
content
├── en
│   └── home
│       ├── content.md
│       ├── description.md
│       └── subpage
│           ├── content.md
│           └── subsubpage
│               └── content.md
└── fr
    └── home
        ├── content.md
        ├── description.md
        └── subpage
            ├── content.md
            └── subsubpage
                └── content.md
```

1. 1 directory per language: here we have two languages: `fr` and `en`).
2. 1 directory per internal menu item: here we have only one internal menu item which is home (since `external: false`).
3. As many directories as you want per subpages in a recursive manner. We have `subpage` and `subsubpage` in the example.

The default content is written in a file called `content.md`. Your theme may allow you to have more than one markdown file per template (see the *Writing themes* section for details), but it is not mandatory.

### Writing content

Alex uses [Github-flavored markdown](https://github.github.com/gfm/) to generate content. The markdown can also be augmented using YAML header. For instance:

```md
---
template: home.htm
---
# Title

Markdown is so cool!
```

In the previous example, the header contains a `template` metadata. If the theme you are using provides a template called `home.htm`, it's going to be used to generate the HTML.

All files in a directory should use the same template to avoid weird behaviours.


### Managing data

Sometimes you need to have static files shipped with your website. You can put those files in data. We distinguish between images and other files, so the directory content looks like that:

```
data
├── files
│   └── article.pdf
└── imgs
    └── test.png
```

In your markdown you can the images in data using `/assets/user/imgs/test.png` and the other files using `/assets/user/files/article.pdf`.

## Writing new themes

If you would like to customize or create a new theme. Please read [this](./THEMES.md)

## Contributing

If you would like to contributing, please read [this](./CONTRIBUTING.md)
