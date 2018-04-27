YX : Node SCSS Gulp Starter
===========================

> A Gulp/Node-based project to help you kickstart your templates with HTML/JS/SCSS, uses Bootstrap 4 and FontAwesome5 (free).

The premise of this project is simple: fork it, code your HTML/CSS/JS and build it. The resulting project is bundle containing your HTML template references, minified CSS including all libraries used and JS filed for the libraries and your own minified code.

If you change something in your project/template, just rinse and repeat. :wink:

This came out of my frustration of having to set up everything by hand whenever I had to write HTML templates before building a WordPress theme, for example.

-----

## Dependencies

You're going to need `Node.js`, no need for global packages.

Just run the `npm install` on the repository's root to install all dependencies.

-----

## How to

After doing your thing, all you need to do is place your assets and code inside the `src` directory and run one of these commands:
- `npm run start`: will run the project in development mode, with watchers for files and assets and with sourcemaps, you'll run this one mostly when you're developing/debugging;
- `npm run start:production`: runs the project in production mode, with watchers but no sourcemaps;
- `npm run build`: generates the production build of your project;

-----

## Author

**Fabio Yuiti Goto** ([lab@yuiti.com.br](mailto:lab@yuiti.com.br))

-----

## License

This project is licensed under the `MIT License`. Please check the `LICENSE.md` file for more information.

-----

_©2018 Fabio Y. Goto_
