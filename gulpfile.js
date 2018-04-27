/**
 * PROJECT_NAME : Gulpfile
 * ----------------------------------------------------------------------
 * Contains the build tasks and file watchers for Gulp.
 * 
 * @author    SomeAuthorName <yourmail@domain>
 * @since     0.0.1
 */
(function() {
  "use strict";

  // Gulp libs
  // --------------------------------------------------------------------
  const __if = require("gulp-if");
  const autoprefixer = require("gulp-autoprefixer");
  const clean_css = require("gulp-clean-css");
  const concat = require("gulp-concat");
  const del = require("del");
  const flatten = require("gulp-flatten");
  const gulp = require("gulp");
  const jshint = require("gulp-jshint");
  const minimist = require("minimist");
  const rename = require("gulp-rename");
  const sass = require("gulp-sass");
  const shell = require("gulp-shell");
  const sourcemaps = require("gulp-sourcemaps");
  const uglify = require("gulp-uglify");
  const util = require("gulp-util");
  
  // Load and set parameters
  // --------------------------------------------------------------------

  // Params file
  const params = require("./gulpfile-params");

  // Parse command arguments with minimise
  const option = minimist(
    process.argv.slice(2), 
    params.plugins.minimist
  );

  // Set production mode
  const production = (option.env === "production");

  // Set build paths
  const path = {
    root: `${params.path.builds + option.env}/`,
    css: `assets/css/`,
    js: `assets/js/`
  };

  // Helper functions
  // --------------------------------------------------------------------

  /**
   * Handles error messages.
   * 
   * Emit is optional, and commented, because it kinda breaks the watchers.
   * 
   * @param {*} error 
   */
  const handleErrors = (error) => {
    console.log(error.toString());
    //this.emit("end");
  }

  // Pre-build/cleaning
  // --------------------------------------------------------------------

  /**
   * Clears the previous build, before building a new one.
   * 
   * @returns {object}
   */
  function cleanBuild() {
    return del([
      path.root
    ]);
  }

  /**
   * Parses all JS files using JSHint.
   * 
   * @returns {object}
   */
  function lintJS() {
    return gulp.src([
      `${params.path.source}**/*.js`, 
      `!${params.path.source}**/dummy/*.js`
    ]).pipe(
      jshint()
    ).pipe(
      jshint.reporter("jshint-stylish")
    );
  }

  // Libraries and dependencies
  // --------------------------------------------------------------------
  
  /**
   * Bundles all JS libraries into a single bundle.
   *
   * @returns {object}
   */
  function bundleJS() {
    return gulp.src([
      `${params.path.module}jquery/dist/jquery.min.js`,
      `${params.path.module}popper.js/dist/umd/popper.min.js`,
      `${params.path.module}bootstrap/dist/js/bootstrap.min.js`
    ]).pipe(
      concat("bundle.js")
    ).pipe(
      uglify()
    ).on(
      "error",
      handleErrors
    ).pipe(
      rename(params.plugins.rename.js_libs)
    ).pipe(
      gulp.dest(path.root + path.js)
    );
  }

  /**
   * Copies all FontAwesome font files to the assets folder.
   */
  function fontAwesomeFonts() {
    return gulp.src([
      `${params.path.module}**/webfonts/fa-brands-400.*`,
      `${params.path.module}**/webfonts/fa-regular-400.*`,
      `${params.path.module}**/webfonts/fa-solid-900.*`
    ]).pipe(
      flatten()
    ).pipe(
      gulp.dest(`${path.root}assets/fonts/`)
    );
  }

  // Build task functions
  // --------------------------------------------------------------------
  
  /**
   * Copies all assets (fonts, images, data) to the assets folder, inside
   * the build path.
   *
   * @returns {object}
   */
  function copyAssets() {
    return gulp.src([
      `${params.path.source}assets/**/*`,
      `!${params.path.source}assets/**/dummy/**/*`,
      `!${params.path.source}assets/**/uploads/**/*`
    ]).pipe(
      gulp.dest(`${path.root}assets/`)
    );
  }

  /**
   * Copies all project's HTML files to the build path.
   * 
   * @returns {object}
   */
  function buildHTML() {
    return gulp.src([
      `${params.path.source}**/*.html`, 
      `!${params.path.source}**/dummy/*.html`
    ]).pipe(
      flatten()
    ).pipe(
      gulp.dest(path.root)
    );
  }

  /**
   * Builds the SCSS files from the project.
   * 
   * @returns {object}
   */
  function buildSCSS() {
    return gulp.src([
      `${params.path.source}scss/main.scss`
    ]).pipe(
      // Render sourcemaps only on development mode
      __if(!production, sourcemaps.init())
    ).pipe(
      sass(params.plugins.sass).on("error", sass.logError)
    ).on(
      "error", 
      handleErrors
    ).pipe(
      autoprefixer(params.plugins.autoprefixer)
    ).pipe(
      clean_css(params.plugins.clean_css)
    ).pipe(
      rename(params.plugins.rename.scss)
    ).pipe(
      __if(!production, sourcemaps.write("."))
    ).pipe(
      gulp.dest(path.root + path.css)
    );
  }

  /**
   * Concats and builds all the project's JS files.
   * 
   * Does not include JS libraries, though.
   * 
   * @returns {object}
   */
  function buildJS() {
    return gulp.src([
      `${params.path.source}js/**/*.config.js`, 
      `${params.path.source}js/**/*.helper.js`, 
      `${params.path.source}js/**/*.module.js`, 
      `${params.path.source}js/**/*.plugin.js`, 
      `${params.path.source}js/main.js`
    ]).pipe(
      // Render sourcemaps only on development mode
      __if(!production, sourcemaps.init())
    ).pipe(
      concat("build.js")
    ).pipe(
      uglify()
    ).on(
      "error", 
      handleErrors
    ).pipe(
      rename(params.plugins.rename.js)
    ).pipe(
      __if(!production, sourcemaps.write("."))
    ).pipe(
      gulp.dest(path.root + path.js)
    );
  }

  // Project watchers
  // --------------------------------------------------------------------

  /**
   * File watcher for assets.
   */
  function watchAssets() {
    let watch = gulp.watch([
      `${params.path.source}assets/**/*`,
      `!${params.path.source}assets/**/dummy/**/*`,
      `!${params.path.source}assets/**/uploads/**/*`
    ]);

    // Execute on change
    watch.on("all", (evt, file, stats) => {
      util.log(
        `File: ${file} | Event: ${evt} | Building files...`
      );

      // Copying assets
      copyAssets();
    });
  }

  /**
   * File watcher for HTML.
   */
  function watchHTML() {
    let watch = gulp.watch([
      `${params.path.source}**/*.html`, 
      `!${params.path.source}**/dummy/*.html`
    ]);

    // Execute on change
    watch.on("all", (evt, file, stats) => {
      util.log(
        `File: ${file} | Event: ${evt} | Building files...`
      );

      // Copying assets
      buildHTML();
    });
  }

  /**
   * File watcher for JS.
   */
  function watchJS() {
    let watch = gulp.watch([
      `${params.path.source}js/**/*.js`
    ]);

    // Execute on change
    watch.on("all", (evt, file, stats) => {
      util.log(
        `File: ${file} | Event: ${evt} | Building files...`
      );

      // Copying assets
      buildJS();
    });
  }

  /**
   * File watcher for SCSS.
   */
  function watchSCSS() {
    let watch = gulp.watch([
      `${params.path.source}scss/**/*.scss`
    ]);

    // Execute on change
    watch.on("all", (evt, file, stats) => {
      util.log(
        `File: ${file} | Event: ${evt} | Building files...`
      );

      // Copying assets
      buildSCSS();
    });
  }

  // Runner
  // ----------------------------------------------------------------------

  /**
   * Runs the project on the designated port.
   * 
   * @returns {object}
   */
  function run() {
    return gulp.src(
      path.root
    ).pipe(
      shell(`serve -p ${params.port} ${path.root}`)
    );
  }

  // Gulp Tasks
  // ----------------------------------------------------------------------

  // Prepare
  gulp.task(
    "prepare", 
    gulp.series(
      cleanBuild, 
      lintJS
    )
  );

  // Builds/copies libraries
  gulp.task(
    "libs", 
    gulp.parallel(
      bundleJS, 
      fontAwesomeFonts
    )
  );

  // Build task
  gulp.task(
    "build", 
    gulp.series(
      "prepare", 
      "libs", 
      gulp.parallel(
        buildHTML, 
        buildJS, 
        buildSCSS, 
        copyAssets
      )
    )
  );

  // Watcher
  gulp.task(
    "watch", 
    gulp.parallel(
      watchAssets, 
      watchHTML, 
      watchJS, 
      watchSCSS
    )
  );

  // Runner task
  gulp.task(
    "start", 
    gulp.series(
      "build", 
      gulp.parallel(
        "watch", 
        run
      )
    )
  );
})();
