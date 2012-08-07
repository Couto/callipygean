#!/usr/bin/env node

/*!
 * Javascript Preprocessor
 * Mimicks the #include syntax in C
 *
 * @example
 *
 * //#include "relative/folder/file.js";
 *
 * Copyright (c) 2012 Couto
 * Licensed under the MIT license.
 */

// Dependencies
var fs = require('fs'),
    path = require('path'),
    // args
    args = process.argv,
    input = args[2],
    output = args[3],
    // files and stuff
    folder = path.dirname(input),
    file = fs.readFileSync(input, 'utf8'),

    merged = file.replace(/\/\/\#include \"(.+)\"\;/g, function (str, group) {
        return fs.readFileSync(path.resolve(folder, group), 'utf8');
    });

return (!output) ?
    process.stdout.write(merged) :
    (function () {
        fs.writeFileSync(output, merged, 'utf8');
        process.stdout.write(output);
        process.exit();
    }());
