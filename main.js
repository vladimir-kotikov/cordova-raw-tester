/* jshint node: true */

var Q = require('q');
var fs = require('fs');
var shell = require('shelljs');
var events = require('cordova-lib').events;
var cordova = require('cordova-lib').cordova;

events.on('log', console.log)
    .on('warn', console.warn);

Q().then(function () {
    if (fs.existsSync('./temp/platforms/windows')) {
        shell.pushd('./temp');
        return Q();
    }

    return cordova.raw.create('./temp')
    .then(function () {
        shell.pushd('./temp');
        return cordova.raw.platform('add', ['windows@4.3.0']);
    });
})
.then(function () {
    return cordova.raw.build({
        platforms: ['windows'],
        options: {
            archs: "x86",
            argv: ['--appx=uap']
        }
    });
})
.then(function () {
    return cordova.raw.build({
        platforms: ['windows'],
        options: ['--release']
    });
})
.done(null, function (err) {
    shell.rm('-rf', './temp');
    console.error(err);
});
