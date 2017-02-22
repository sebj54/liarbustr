# Contributing to Liarbustr

[WIP]

## Tools

### Server

To run our app, you may install dev dependencies with `npm install`. Then you have to run the server (provided by [Gulp](http://gulpjs.com/)) with the folowing command:

```bash
gulp
```

The server will open in the browser. You may encounter a 404 error because `liarbustr.com` does not redirect to your computer. Edit your `/etc/hosts` file to add this new line: `127.0.0.1 liarbustr.com`.

The server uses [Browsersync](https://browsersync.io/). Your browser will reload the page once there is a change on the files.

### Sass

We use Sass to write our CSS. By launching the server, the CSS files will be watched and compiled to a minified CSS file (with sourcemaps!). Once the minified file is build, your browser will reload.

To compile the files manually use the folowing command:

```bash
gulp compile-css
```

### SVG symbols

We use SVG symbols in our HTML for vector icons. All our SVG files are compiled to a single file automatically. Simply drop a SVG file in the `/svg` folder to add it to the compiled file. It will also be optimized with [SVGO](https://github.com/svg/svgo).

To compile the files manually use the folowing command:

```bash
gulp compile-svg
```

## Styleguides

## General

- Only Unix line endings (LF)
- Soft tabs: 4 spaces

## Git commit messages

- Start by adding the feature you've worked on between squared brackets e.g. `[user]`, `[i18n]`, `[doc]`...
- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Reference issues and pull requests liberally

### JavaScript styleguide

All JavaScript must follow our code style before being committed. Use [ESLint](http://eslint.org/) to ensure your code will be compliant. The most comfortable solution is the editor plugin.
In Atom, you may install [linter](https://atom.io/packages/linter) and [ESLint](https://atom.io/packages/linter-eslint) packages.

Our styleguide extends [Airbnb's one](https://github.com/airbnb/javascript). Here are the differences with it:

- Braces style: [Allman](http://eslint.org/docs/rules/brace-style#allman). All the braces are expected to be on their own lines without any extra indentation.
- No semicolons
- Indentation with 4 spaces
- No space before function parenthesis
- No max length for lines
- Anonymous functions are allowed
- Objects passed as parameters can have their properties reassigned
- Unary operatos (`++` and `--`) are allowed in for loops
- Object shorthands are not necessary
- Arrow callbacks are not preferred
- String concatenation are allowed, template literals are not mandatory
