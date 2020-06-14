# Alex!

[![GitHub release][release-image]][release-url]
[![MIT License][license-image]][license-url]

[release-image]:https://img.shields.io/github/release/etermind/alex.svg?style=flat-square
[release-url]:https://github.com/etermind/alex/releases/latest
[license-image]:http://img.shields.io/badge/license-MIT-000000.svg?style=flat-square
[license-url]:LICENSE.txt

Welcome to Alex! Alex is a minimalist static site generator written in TypeScript.

## Why?

Because my roommate needed a minimalistic static generator way less complicated than [Hugo](https://gohugo.io) or [Hexo](https://hexo.io).

## How easy can it get?

Using standard technologies and well-known libraries, Alex is only 350 lines of code with comments!

## Is it powerful?

Alex is powerful enough! But if you expect a fully-featured static site generator, please use something else.

## What features do we have?

- Multilingual support
- Themable
- Code highlighting (using [highlightjs](https://highlightjs.org))
- Markdown (Github flavor)
- Users defined file
- Pages and subpages
- Small and easy configuration

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

## Writing themes

A theme directory has the following structure:

```
theme/
├── css
│   ├── default.css
│   └── menu.css
├── fonts
├── html
│   ├── en
│   │   └── home.htm
│   ├── fr
│   │   └── home.htm
│   ├── head.htm
│   └── menu.htm
├── imgs
└── js
```

- `css` contains all your CSS files
- `js` contains all your JS files
- `fonts` contains all your fonts
- `imgs` contains all your images
- `html` contains the multilingual HTML templates

You can reference your assets (css, js, imgs, fonts) in the HTML templates using `/assets/css|js|fonts|imgs/file`.

### Content of the html directory

The `html` directory contains at least one directory per supported language and an `index.htm` file in each directory.

Alex uses the [nunjucks template engine](https://mozilla.github.io/nunjucks/) to generate HTML content.

Any file in `html` can be referenced by the templates and be used as partial templates.

Alex passes the following object to each template:

```js
{
    title: 'Website title for the current language',
    menu: [menuItemKey, menuObject],
    content: {
        metadata: {},
        content: 'CONTENT FROM content.md',
        [key]: 'CONTENT FROM x.md'
    },
    lang: 'THE CURRENT LANGUAGE',
    meta: {
        keywords: 'Comma separated keywords',
        description: 'Meta description in the current language',
        [key]: 'Any other meta'
    },
    subpages: ['subpage1', 'subpage2'], // List of the subpages' name
}
```

### Designing a simple theme:

- Start by creating the default structure:

```
theme/
├── css
│   ├── main.css
├── html
│   ├── en
│   │   └── index.htm
├── fonts
├── imgs
└── js
```

- Create the content of `en/index.htm`:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <meta name="description" content="{{meta.description}}"></meta>
        <meta name="keywords" content="{{meta.keywords}}"></meta>
        <link rel="stylesheet" href="/assets/css/main.css" type="text/css" media="all">
        <title>{{title}}</title>
    </head>
    <body>
        <h1 class="h1">{{title}}</h1>

        <section>
            {{content.content | safe}}
        </section>
    </body>
</html>
```

The [safe filter](https://mozilla.github.io/nunjucks/templating.html#safe) is used to tell Nunjucks to not escape the HTML generated from the markdown file. You can add the whole power of Nunjucks to generate complex templates and HTML files. You are limited by your imagination. 

- Add the relevant CSS in main.css and the relevant JS files

### Including partial templates

Often it is useful to break the HTML templates into reusable chunks. You can use the [include](https://mozilla.github.io/nunjucks/templating.html#include) directive from Nunjucks. For instance, if you wan to have a partial template for the HTML head, you can do it like this:

```
theme/
├── css
│   ├── main.css
├── html
│   ├── en
│   │   └── index.htm
│   ├── head.htm
├── fonts
├── imgs
└── js
```

`head.htm`:

```html
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <meta name="description" content="{{meta.description}}"></meta>
    <meta name="keywords" content="{{meta.keywords}}"></meta>
    <link rel="stylesheet" href="/assets/css/main.css" type="text/css" media="all">
    <title>{{title}}</title>
</head>
```

And then, `en/index.htm` becomes:

```html
<!DOCTYPE html>
<html>
    {% include "../head.htm" %}
    <body>
        <h1 class="h1">{{title}}</h1>
         
        <section>
            {{content.content | safe}}
        </section>
    </body>
</html>
```

### Using pages & subpages and referencing them

When Alex generates your website, it outputs a structure like this:

```
corentin
├── assets
│   ├── css
│   │   ├── default.css
│   │   ├── menu.css
│   ├── fonts
│   ├── imgs
│   ├── js
│   └── user
│       ├── files
│       └── imgs
├── en
│   └── home
│       ├── index.htm
│       └── subpage
│           ├── index.htm
│           └── subsubpage
│               └── index.htm
├── fr
│   └── home
│       ├── index.htm
│       └── subpage
│           ├── index.htm
│           └── subsubpage
│               └── index.htm
└── index.htm
```

As you can see, each HTML file is called `index.htm` and respects the structure of the `content` directory.

So you can reference the pages and the subpages using that structure. The direct subpages are also passed to the nunjucks template using the `subpages` array.

### Working with multiple markdown fragments

You are free to use as many markdown fragments as you want for a single page.

Alex passes all markdown fragments to the nunjucks template using the `content` object:

```js
{
    content: {
        metadata: {}, // Merging of metadata from all markdown files 
        content: 'HTML from content.md',
        description: 'HTML from description.md',
        title: 'HTML from title.md',
    }
}
```

This one, you can design complex themes and allow your users to split their markdown files into chunks.

## Contributing

Alex is a small project. It has been done in less than a day. It is powerful enough, but of course it lacks features.

If you want to contribute, you can send a pull request provided that the linter passes without modifying the rules, the documentation is updated and the code is clean. 

We really like to keep Alex minimalistic as it is now so that people can dig into it very quickly. Thanks :)

## Development

The code sources is in `lib`:

```
lib
├── actions
│   ├── generate.ts
│   ├── index.ts
│   └── serve.ts
├── cli.ts
├── errors
    └── index.ts
```

- `cli.ts` contains the two actions `generate` and `serve`. We are using [commander](https://github.com/tj/commander.js/) to parse the command line.
- `action/serve.ts` contains the small static server to serve the website content for testing purpose.
- `action/generate.ts` contains the code to generate the website. This is Alex's brain.
- `errors/index.ts` contains all the errors that Alex can raise when he is unhappy.

### actions/generate.ts

The file contains the following functions executed in the following order:

- `generate`, the main function. It iterates over the languages list and generate each page.
- `generatePages`. It iterates over the menu items and generate one page per item for the current language.
- `generatePage`. It grabs the markdown files from the root path and run the recursive generation.
- `generatePageRecursively`. It extracts the content from the markdown files, then grabs the template file and injects the content to output the final HTML file. It uses to helper functions:
    * `extractMarkdown`. It extracts the markdown of all files.
    * `renderTemplate`. It sends content to nunjucks and retrieves the HTML content.
Finally, it recursively enumerates all the directories inside the path and starts again.
- `copyIndexFile`. It copies the default page into the root of the output directory and rename it to `index.htm` to make it the index page of your website.
- `copyFiles`. It copies all the static files and put it in the output directory.
