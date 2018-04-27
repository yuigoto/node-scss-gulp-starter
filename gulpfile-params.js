/**
 * PROJECT_NAME : Gulpfile Params
 * ----------------------------------------------------------------------
 * Parameters used in the `Gulpfile`, for some of the modules.
 * 
 * @author    SomeAuthorName <yourmail@domain>
 * @since     0.0.1
 */
module.exports = {
  // Development server port
  // --------------------------------------------------------------------
  port: 24,

  // Build, source and module paths
  // --------------------------------------------------------------------
  path: {
    // Export path route
    builds: "build/",
    // Node modules
    module: "node_modules/",
    // Source path
    source: "src/"
  },

  // Plugins
  // --------------------------------------------------------------------
  plugins: {
    // Autoprefixer
    // ------------------------------------------------------------------
    autoprefixer: [
      "Android 2.3",
      "Android >= 4",
      "Chrome >= 20",
      "Firefox >= 24",
      "Explorer >= 8",
      "iOS >= 6",
      "Opera >= 12",
      "Safari >= 6"
    ],

    // Clean CSS
    // ------------------------------------------------------------------
    clean_css: {
      level: {
        1: {
          specialComments: "none"
        }
      }
    },

    // Minimist
    // ------------------------------------------------------------------
    minimist: {
      string: "env",
      default: {
        env: "development"
      }
    },

    // Rename
    // ------------------------------------------------------------------
    rename: {
      js: {
        basename: "build",
        dirname: "",
        suffix: ".min"
      },
      js_libs: {
        basename: "bundle",
        dirname: "",
        suffix: ".min"
      },
      scss: {
        basename: "build",
        dirname: "",
        suffix: ".min"
      }
    },

    // SASS
    // ------------------------------------------------------------------
    sass: {
      outputStyle: "compressed",
      precision: 8,
      includePaths: [
        "node_modules"
      ]
    }
  }
};
