const resetRegexp = (regexp) => { regexp.lastIndex = 0; return regexp; };

/** Injects a string into the source code 
 * @param {{target: (string | RegExp), injectedString: string}} config */
function StringInjectionPlugin(config) {
    this.name = "StringInjectionPlugin";
    this.config = config;
    if (config == null) throw new Error(this.name + " requires a config argument specified.");
    if (config.target == null) throw new Error(this.name + " config requires the target option specified.");
    if (config.injectedString == null) throw new Error(this.name + " config requires the injectedString option specified.");
}

StringInjectionPlugin.prototype.apply = function(compiler) {
    const paths = this.config.paths || [];
    const isRecursive = this.config.recursive || false;

    compiler.hooks.emit.tap(this.name, (compilation) => {          
        compilation.hooks.finishModules.tap(this.name, (modules) => {

            modules.forEach(mod => {
                
                mod._source._value = mod._source._value.replace(new RegExp(this.config.target), this.config.injectedString);
            });
            
        });
    });
};

module.exports = StringInjectionPlugin;