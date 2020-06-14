# Writing themes

If you would like to write a custom theme for Alex, it is possible and easy.

All you need is to follow those guidelines. In 10 minutes, you'll have your structure and you can start customizing the HTML pages and CSS files. 

## Directory structure

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

## Content of the html directory

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

## Tutorial: Designing a simple theme:

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

## Advanced topics

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
