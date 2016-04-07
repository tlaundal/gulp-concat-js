`gulp-concat-js`
====================

Gulp plugin for concatenating javascript with sourcemaps.
This gulp plugin will concatenate all source files together with some magic,
so that it still works to `require` the other files. You only have to ensure you always
use "./" when requiring local modules.

If you run your code through an uglifier after this, you have obfuscated your code!

# Usage
This module is made for a specific, and will be limited in functionality and flexibility.
Using it without source maps is not supported.

Here is a very simple gulpfile for using this module:
```js
var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat-js");

gulp.task("build", function () {
    return gulp.src(["lib/*.{js,json}", "lib/**/*.{js,json}"])
        .pipe(sourcemaps.init())
          .pipe(concat({
              "target": "concatenated.js", // Name to concatenate to
              "entry": "./main.js" // Entrypoint for the application, main module
                                   // The `./` part is important! The path is relative to
                                   // whatever gulp decides is the base-path, in this
                                   // example that is `./lib`
          }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist"));
});
```

# License
See `LICENSE.md`
