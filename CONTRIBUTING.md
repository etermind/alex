# Contributing

Alex is a small project. It has been done in less than a day. It is powerful enough, but of course it lacks features.

If you want to contribute, you can send a pull request provided that:

1. The linter passes without modifying the rules;
2. The documentation is updated 
3. You follow the [Conventional commit convention](https://www.conventionalcommits.org/en/v1.0.0-beta.4/);
4. And the code is clean.

We really like to keep Alex minimalistic as it is now so that people can dig into it very quickly. Thanks :)

## Code source overview

All the code source is in the `lib` directory:

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

### Generate 

The file `actions/generate.ts`, which is Alex's brain, contains the following functions executed in the following order:

- `generate`, the main function. It iterates over the languages list and generate each page.
- `generatePages`. It iterates over the menu items and generate one page per item for the current language.
- `generatePage`. It grabs the markdown files from the root path and run the recursive generation.
- `generatePageRecursively`. It extracts the content from the markdown files, then grabs the template file and injects the content to output the final HTML file. It uses to helper functions:
    * `extractMarkdown`. It extracts the markdown of all files.
    * `renderTemplate`. It sends content to nunjucks and retrieves the HTML content.

Finally, it recursively enumerates all the directories inside the path and starts again.
- `copyIndexFile`. It copies the default page into the root of the output directory and rename it to `index.htm` to make it the index page of your website.
- `copyFiles`. It copies all the static files and put it in the output directory.
