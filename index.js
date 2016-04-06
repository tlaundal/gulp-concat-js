"use strict";

var through = require("through2");
var path = require("path");
var fs = require("fs");
var gutil = require("gulp-util");
var PluginError = gutil.PluginError;
var File = gutil.File;
var Concat  = require("concat-with-sourcemaps");

module.exports = function(options) {

    var latestFile;
    var latestMod;
    var concat = new Concat(true, options.file, gutil.linefeed);

    var prefix = fs.readFileSync(path.join(__dirname, "lib/prefix.js"), "utf-8");
    var suffix = fs.readFileSync(path.join(__dirname, "lib/suffix.js"), "utf-8");

    var beginning = fs.readFileSync(path.join(__dirname, "./lib/beginning.js"), "utf-8");
    var end = fs.readFileSync(path.join(__dirname, "./lib/end.js"), "utf-8");
    end = end.replace("{entry}", options.entry);

    concat.add("./obfuscator/beginning.js", beginning);


    function bufferContents(file, encoding, next) {
        if (file.isNull()) {
            return next();
        }

        if (file.isStream()) {
            this.emit("error", new PluginError("gulp-obfuscator-js", "Streaming is not supported!"));
            return next();
        }

        if (!latestMod || file.stat && file.stat.mtime > latestMod) {
            latestFile = file;
            latestMod = file.stat && file.stat.mtime;
        }

        concat.add(null, prefix.replace("{file-relative}", "./" + file.relative));
        if (file.relative.endsWith(".json")) {
            concat.add(null, "module.exports = ");
            concat.add(file.relative, file.contents, file.sourceMap);
            concat.add(null, ";")
        } else {
            concat.add(file.relative, file.contents, file.sourceMap);
        }
        concat.add(null, suffix);

        next();
    }

    function endStream(next) {
        if (!latestFile) {
            return next();
        }

        concat.add("./obfuscator/end.js", end);

        var joinedFile = latestFile.clone({contents: false});
        joinedFile.path = path.join(latestFile.base, options.file);
        joinedFile.contents = concat.content;
        joinedFile.sourceMap = JSON.parse(concat.sourceMap);
        this.push(joinedFile);

        next();
    }

    return through.obj(bufferContents, endStream);
};
