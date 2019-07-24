const Log = function(devMode) {
    var empty = function() {}
    for (var key in window.console) {
        if (devMode) {
            this[key] = console[key]
        } else {
            this[key] = empty
        }
    };
}

export default Log