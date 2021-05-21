"use strict";
exports.__esModule = true;
exports.isTask = void 0;
function isTask(x) {
    return x && x.onDone;
}
exports.isTask = isTask;
function createTask(createFn) {
    var finished = false;
    var value;
    var listeners = [];
    var done = function (arg) {
        if (finished === true)
            return;
        value = arg;
        finished = true;
        listeners.forEach(function (fn) { return fn(value); });
        listeners = [];
    };
    var onSkip = createFn(done);
    var task = {
        onDone: function (fn) {
            if (!finished)
                listeners.push(fn);
            if (finished)
                fn(value);
            return task;
        },
        skip: function () {
            if (!finished)
                done(onSkip());
            return task;
        },
        getStatus: function () { return finished; },
        getValue: function () { return value; }
    };
    return task;
}
exports["default"] = createTask;
