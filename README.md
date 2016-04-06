`gulp-concat-js`
====================

Gulp plugin for concatenating javascript with sourcemaps.
This gulp plugin will concatenate all source files together with some magic,
so that it still works to `require` the other files. You only have to ensure you always
use "./" when requiring local modules.

If you run your code through an uglifier after this, you have obfuscated your code!


# License
See `LICENSE.md`
