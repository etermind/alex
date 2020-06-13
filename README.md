# This is Alex!

Alex is a small and simple static site generator.

## Why?

Because my roommate needed a small static generator way less complicated than [Hugo](https://gohugo.io) or [Hexo](https://hexo.io).

## How easy can it get?

Using standard technologies and well-known libraries, Alex is only 300 lines of code with comments!

## Is it powerful?

Alex is powerful enough! But if you expect a full-featured static site generator, please use something else.

## What features do we have?

- Multilingual support
- Themable
- Markdown (Github flavor)
- Users defined file
- Small and easy configuration

## Getting started

```sh
npm install @etermind/alex -g
```

You'll end up with `alex` in your PATH and then you can just do:

```sh
alex generate -i INPUT_DIR_WITH_CONTENT -o OUTPUT_DIR_WITH_GENERATED_SITE
```

Let's try it out: 

1. Download the example skeleton [here](./skeleton.zip);
2. Then unzip the skeleton (`unzip skeleton.zip` should do);
3. Then run `alex` with `alex -i skeleton -o mysite`
4. You should end up with a folder called `mysite`
5. Open `index.htm` inside the `mysite` folder in a browser and admire your new site

