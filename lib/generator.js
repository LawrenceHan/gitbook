var _ = require("lodash");
var path = require("path");
var Q = require("q");
var fs = require("./utils/fs");

var BaseGenerator = function(book, options) {
    this.options = options;

    // Base for assets in plugins
    this.pluginAssetsBase = "book";
};

BaseGenerator.prototype.callHook = function(name, data) {
    return this.plugins.hook(name, data);
};

// Sets up generator
BaseGenerator.prototype.load = function() {
    return this.loadPlugins();
};

BaseGenerator.prototype.preparePlugins = function() {
    var that = this;


};

BaseGenerator.prototype.convertFile = function(content, input) {
    return Q.reject(new Error("Could not convert "+input));
};

BaseGenerator.prototype.transferFile = function(input) {
    return fs.copy(
        path.join(this.options.input, input),
        path.join(this.options.output, input)
    );
};

BaseGenerator.prototype.transferFolder = function(input) {
    return fs.mkdirp(
        path.join(this.options.output, input)
    );
};

BaseGenerator.prototype.copyCover = function() {
    var that = this;

    return Q.all([
        fs.copy(path.join(this.book.root, "cover.jpg"), path.join(this.options.output, "cover.jpg")),
        fs.copy(path.join(this.book.root, "cover_small.jpg"), path.join(this.options.output, "cover_small.jpg"))
    ])
    .fail(function() {
        // If orignaly from multi-lang, try copy from parent
        if (!that.isMultilingual()) return;

        return Q.all([
            fs.copy(path.join(that.book.parentRoot(), "cover.jpg"), path.join(that.options.output, "cover.jpg")),
            fs.copy(path.join(that.book.parentRoot(), "cover_small.jpg"), path.join(that.options.output, "cover_small.jpg"))
        ]);
    })
    .fail(function(err) {
        return Q();
    });
};

BaseGenerator.prototype.langsIndex = function(langs) {
    return Q.reject(new Error("Langs index is not supported in this generator"));
};

BaseGenerator.prototype.finish = function() {
    return Q.reject(new Error("Could not finish generation"));
};

module.exports = BaseGenerator;